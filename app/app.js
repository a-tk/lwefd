var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var reqLogger= require('morgan');
var log4js = require('log4js');
/*
log4js.configure({
  appenders: [
    {type: 'console'},
    {type: 'file', filename: 'logs/app.log', category: 'app'}
  ]
});
*/

var bodyParser = require('body-parser');

var app = express();
var log = log4js.getLogger('app');
var environment = app.get('env') || process.argv[2] || 'development';
var serverConfig = require('./env.json')[ environment ];


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(reqLogger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

var index = require('./routes/index.js');
var jobs = require('./routes/jobs.js');

app.use('/', index(log4js, express));
app.use('/jobs', jobs(log4js, express));

/**
 *
 * Status Codes
 *
 */

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});



/**
 *
 * Error Handlers
 *
 */

if (environment === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    log.error(err.message);
    log.error(err.stack);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  log.error(err.message);
  log.error(err.stack);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

var server = app.listen(serverConfig.port, function () {

  log.info('lwefd listening on port '+ serverConfig.port)
});

module.exports = app;
