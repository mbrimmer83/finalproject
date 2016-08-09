var app = require('express')();
var bodyParser = require('body-parser');
var cors = require('cors');
var distance = require('gps-distance');
// var pg = require('pg');
var pgp = require('pg-promise')();

var db = pgp({
  database: 'valetMe'
});
// var db = new pg.Pool({
//   database: 'valetMe'
// });
db.connect();
app.use(bodyParser.json());
app.use(cors());

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
    console.log("The lots ", nearByLots);
  }).then(function(err){
    res.json({
      status:"OK",
      data: nearByLots
    });
  }).catch(function(err) {
    console.log(err);
  });
});

app.listen(8000, function() {
  console.log("Listening on port 8000");
});
