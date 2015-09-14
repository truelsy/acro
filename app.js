var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


////////////////////////////////////////////////////////////////
// Library 모듈　적재
global.db = require(__dirname + "/lib/database");
global.mc = require(__dirname + "/lib/memcached");

var Logger  = require(__dirname + "/lib/logger");
global.log  = new Logger(__dirname + "/logs/debug");
global.loge  = new Logger(__dirname + "/logs/exception");

var mongo = require(__dirname + "/lib/mongodb");
var redis = require(__dirname + "/lib/redis");
////////////////////////////////////////////////////////////////



////////////////////////////////////////////////////////////////
// Routing...
app.use('/login', require('./routes/login'));
app.use('/items', require('./routes/items'));
app.use('/ranking', require('./routes/ranking'));
////////////////////////////////////////////////////////////////




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


process.on('uncaughtException', function (err) {
	loge.error('Caught exception: ' + err);
});


module.exports = app;
