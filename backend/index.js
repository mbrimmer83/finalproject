var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var distance = require('gps-distance');
var app = express();
var stripe = require('stripe')('sk_test_T8RSd0lfz4iE7qT93n7JT0Wh');
var randtoken = require('rand-token');
var bluebird = require('bluebird');
var bcrypt = bluebird.promisifyAll(require('my-bcrypt'));
require('dotenv').config();
//Socket.io requirements
var http = require('http').Server(app);
var io = require('socket.io')(http);
var nsp = io.of('/custom-lot');

// Database requirements
var pgp = require('pg-promise')();
var db = pgp({
    database: process.env.DBNAME,
    host: process.env.DBHOST,
    port: process.env.DBPORT,
    user: process.env.DBUSER,
    password: process.env.DBPASS,
    ssl: true
});

db.connect();
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('frontend'));

// Signup
app.post('/signup', function(req, res) {
  var userInfo = req.body;
  bcrypt.hash(userInfo.password, 10, function(err, hash){
    if (err) {
      res.json({status: "Failed"});
      return;
    }
    else if (req.body.usertype === 'lotuser') {
      db.query('insert into users values(default, $1, $2, $3, default)', [req.body.username, hash, req.body.name]);
    }
    else if (req.body.usertype === 'lotmanager') {
      db.query('insert into lot_users values(default, $1, $2, $3, $4, default)', [req.body.company, req.body.username, hash, req.body.name]);
    }
    res.json({status: "OK"});
  });
});

// User login
app.post('/login', function(req, res) {
  var userInfo = req.body;
  var encryptedPassword;
  var theUser;
  var token;
  db.one('select * from users where email = $1', [userInfo.username])
  .catch(function(err) {
    return null;
  })
  .then(function(user){
    if (!user) {
      return db.one('select * from lot_users where email = $1', [userInfo.username]);
    } else {
      return user;
    }
  }).then(function(user){
    if (!user) {
      throw new Error("User not found!");
    }
    else {
      theUser = user;
      return bcrypt.compareAsync(userInfo.password, user.password);
    }
  }).then(function(match){
    if (match) {
      token = randtoken.generate(64);
      return token;
    }
    else {
      throw new Error("Invalid username or password!");
    }
  }).then(function(token) {
    if (theUser.company_name === undefined) {
      return db.query('insert into user_login_tokens values(default, $1, $2, default, default)', [theUser.id, token]);
    } else {
      return db.query('insert into lot_user_login_token values(default, $1, $2, default, default)', [theUser.id, token]);
    }
  }).then(function(){
    res.json({
      status: "Authentication verified!",
      user: theUser,
      token: token
    });
  }).catch(function(err){
    console.log("The error is", err);
    return res.json(err);
  });
});

app.post('/userlots', function(req, res) {
  db.query('select * from lots where lot_user_id = $1', [req.body.userId])
  .then(function(lots){
    res.json({
      data: lots
    });
  })
  .catch(function(err){
    return res.json({status: "No lots found!"});
  });
});

// Get the lots located within 5 miles of location.
app.post('/mobilelotdata', function(req, res) {
  var coords = req.body;
  var nearByLots = [];
  db.query('select * from lots').then(function(res, err){
    for (var i = 0; i < res.length; i++) {
      var locLat = res[i].latitude;
      var locLong = res[i].logitude;
      var result = distance(coords.lat, coords.long, locLat,  locLong);
      if (result <= 8) {
        nearByLots.push(res[i]);
      }
    }
  }).then(function(err){
    res.json({
      status:"OK",
      data: nearByLots
    });
  }).catch(function(err) {
    console.log(err);
  });
});

// Send Stripe token and save transaction in the database
// Change user id when login and signup completed
app.post('/transaction', function(req, res) {
  var transactionData = req.body.transaction;
  var charge = stripe.charges.create({
    amount: req.body.amount,
    currency: "usd",
    source: req.body.token,
    description: "Example charge"
  }, function(err, charge) {
    if (err && err.type === 'StripeCardError') {
      console.log("This card has been declined");
      response.json({
        status: 'fail',
        error: err.message
      });
      return;
    }
    db.query('insert into transactions values(default, $1, $2, default, $3, $4, $5, $6, $7)', [transactionData.lotInfo.id, req.body.user.id, transactionData.lotInfo.lot_type, req.body.amount, req.body.token, transactionData.ticketNumber.ticketNumber, req.body.user.name]).then(function(res) {
    res.json({status: "OK"});
    }).catch(function(err){
      console.log(err);
      return res.json(err);
    });
  });
});

//Get transactions for frontend administration panel
app.post('/lottransactions', function(req, res) {
  db.query('select * from transactions where lot_id = $1 order by transaction_time DESC', [req.body.lotId])
  .then(function(data){
    return res.json({status: "OK", data: data});
  }).catch(function(err){
    return res.json({status: "Query failed!"});
  });
});

// Request the user car to be returned to them
app.post('/requestcar', function(req, res) {
  var data = req.body;
  var lotId = req.body.lotInfo.id;
  db.one('insert into vehicles values(default, $1, 1, $2, $3, $4, false, true, default) RETURNING id, lot_id, user_id, ticket_number, time_needed, push, push_status, on_lot, request_time', [req.body.lotInfo.id, req.body.ticketNumber.ticketNumber, req.body.requestCarInfo.when, req.body.requestCarInfo.push]).then(function(res) {
    io.of('/custom-lot').emit(lotId, {data: res});
    }).catch(function(err){
      console.log(err);
      res.json({status: "Failed to socket request!"});
  });
});

// Socket connection
nsp.on('connection', function(socket) {
  socket.on('joinRoom', function(data){
    socket.join(data);
  });
});

// Get return cars and send to frontend website
app.post('/returncars', function(req, res) {
  db.query('select * from vehicles where lot_id = $1 and on_lot = true', [req.body.lotId])
  .then(function(vehicles) {
    return res.json({data: vehicles});
  })
  .catch(function(err){
    return res.json({status: "Query Failed"});
  });
});

//Remove car from active on lot status
app.post('/removecars', function(req, res) {
  db.query('update vehicles set on_lot = false where id = $1', [req.body.id])
  .then(function(res){
    return res.json({status: "OK"});
  }).catch(function(err){
    return res.json({status: "Failed to update!"});
  });
});
// Insert reviews into database
app.post('/review', function(req, res) {
  db.query('insert into reviews values(default, $1, $2, default, $3, $4, $5, $6, $7, $8)', [req.body.lotData.lotInfo.id, req.body.user.id, req.body.review.star, req.body.review.one, req.body.review.two, req.body.review.three,req.body.review.four,req.body.review.comments])
  .catch(function(err){
    return res.json({status: "Failed to query database!"});
  });
});

app.post('/getreviews', function(req, res) {
  db.query('select review.lot_id, review.user_id, review.review_time, review.stars, review.car_promptly, review.valet_engage, review.valet_prof, review.park_again, review.comments, review.email, review.name from (select * from reviews left outer join users on users.id = reviews.user_id where reviews.lot_id = $1 order by review_time DESC) as review', [req.body.lotId])
  .then(function(reviews){
    res.json({
      data: reviews
    });
  })
  .catch(function(err){
    res.json({status: "Failed"});
    console.log(err);
  });
});

// Listening for socket connections
var port = process.env.PORT || 8000;

http.listen(port, function() {
  console.log("Listening on port " + port + "!");
});
