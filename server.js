// DECLARATIONS
require('dotenv').config()
var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var cookie = require('cookie')
var cookieParser = require('cookie-parser')
var acceptOverride = require('connect-acceptoverride')
var jwt = require('express-jwt')
var slugify = require('slugify')
var moment = require('moment')
var mongoose = require('mongoose')
const io = require('socket.io')(http)

const mongoPath = process.env.NODE_ENV === 'development' ? 'mongodb://localhost/omnivox_db' : 'mongodb://localhost/omnivox_db'

app.use(cookieParser())
mongoose.connect(mongoPath)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// ALLOW CORS
var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
}

// MIDDLEWARES
app.use(express.static('public'))
app.use(acceptOverride())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(allowCrossDomain);
app.use(function (req, res, next) {
  var format = req.query.format
  if (format) { req.headers.accept = 'application/' + format }
  next();
});

// ROUTES


// SOCKETS

io.on('connection', (client) => {
  // Subscribe to Timer
  client.on('subscribeToTimer', (interval) => {
    console.log('client is subscribing to timer with interval ', interval);
    setInterval(() => {
      client.emit('timer', new Date());
    }, interval);
  });
  // Toggle Vote
  client.on('toggleVote', (vote) => {
    client.emit('vote', !vote)
  })
});

const socketPort = 8080;
io.listen(socketPort);
console.log('Socket.io listening on port ', socketPort);

// SERVER
var port = process.env.PORT || 8000;
app.listen(port, function () {
  console.log('SonicCook listening on port 8000!');
});
