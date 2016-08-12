var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var distance = require('gps-distance');
var app = express();
var stripe = require('stripe')('sk_test_T8RSd0lfz4iE7qT93n7JT0Wh');
var bcrypt = require('my-bcrypt');
//Socket.io requirements
var http = require('http').Server(app);
var io = require('socket.io')(http);
var nsp = io.of('/custom-lot');

// Database requirements
var pgp = require('pg-promise')();
var db = pgp({
  database: 'valetMe'
});

db.connect();
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('frontend'));

// Signup
app.post('/signup', function(req, res) {
  var userInfo = req.body;
  console.log(userInfo);
  bcrypt.hash(userInfo.password, 10, function(err, hash){
    if (err) {
      res.json({status: "Failed"});
      return;
    }
    else if (req.body.usertype === 'lotuser') {
      db.query('insert into users values(default, $1, $2, $3)', [req.body.username, hash, req.body.name]);
    }
    else if (req.body.usertype === 'lotmanager') {
      db.query('insert into lot_users values(default, $1, $2, $3, $4)', [req.body.company, req.body.username, hash, req.body.name]);
    }
    res.json({status: "OK"});
  });
});

// User login
app.post('/userlogin', function(req, res) {
  var userInfo = req.body;
  console.log(userInfo);
  bycrpt.hash(userInfo.password, 10, function(err, hash) {
    if (err) {
      res.json({status: "failed"});
      return;
    }
    else {
      db.query('select * from users where users.email = $1', [req.body.email]).then(function(res, err){
        if (err) {
          res.json({status: "User not found!"});
          return;
        }
        else {
          console.log(res);
        }
      });
      }
    });
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
  console.log(req.body);
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
    db.query('insert into transactions values(default, $1, 1, default, $2, $3, $4)', [transactionData.id, transactionData.lot_type, req.body.amount, req.body.token]).then(function(res) {
    console.log("Something happend!");
    res.json({status: "OK"});
    }).catch(function(err){
      console.log(err);
      return res.json(err);
    });
  });
});
// Request the user car to be returned to them
// Change user id when login and signup completed
app.post('/requestcar', function(req, res) {
  console.log("This is the data ",req.body);
  var data = req.body;
  var lotId = req.body.lotInfo.id;
  console.log(lotId);
  io.of('/custom-lot').emit(lotId, {data: req.body});
  console.log("Got past socket");
  db.query('insert into vehicles values(default, $1, 1, $2, $3, $4, false, true, default)', [req.body.lotInfo.id, req.body.ticketNumber.ticketNumber, req.body.requestCarInfo.when, req.body.requestCarInfo.push]).then(function(res) {
    res.json({status: "OK"}).catch(function(err){
      console.log(err);
      res.json(err);
    });
  });
});

// Socket connection
nsp.on('connection', function(socket) {
  console.log('A connection has been made!');
  socket.on('joinRoom', function(data){
    console.log(data);
    socket.join(data);
  });
});




// Listening for socket connections
http.listen(8000, function() {
  console.log("Listening on port 8000!");
});
