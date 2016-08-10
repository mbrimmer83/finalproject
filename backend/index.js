var app = require('express')();
var bodyParser = require('body-parser');
var cors = require('cors');
var distance = require('gps-distance');
var pgp = require('pg-promise')();
var stripe = require('stripe')('sk_test_T8RSd0lfz4iE7qT93n7JT0Wh');

var db = pgp({
  database: 'valetMe'
});

db.connect();
app.use(bodyParser.json());
app.use(cors());

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
    console.log("Reached query!");
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
app.post('/requestcar', function(req, res) {
  console.log("This is the data ",req.body);
});

app.listen(8000, function() {
  console.log("Listening on port 8000");
});
