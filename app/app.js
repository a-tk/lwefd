var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var reqLogger= require('morgan');
var log4js = require('log4js');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var jobs = require('./routes/jobs');
var notify = require('./routes/notify');

var NotificationService = require('./util/Notifications/NotificationService'),
  notificationService = new NotificationService();

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

/**
 *
 * Routes
 *
 */
app.use('/', routes);
app.use('/jobs', jobs);
app.use('/notify', notify);


/**
 *
 * Status Codes
 *
 */

/**
 * 404 - forward to error handler
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

/**
 * Development Error handler
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

/**
 * Production Error Handler
 */
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

notificationService.start();

module.exports = app;
