var express = require('express');
var path = require('path');
//var reqLogger= require('morgan');
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
var environment = process.argv[2] || app.get('env') || 'development';
var serverConfig = require('./env.json')[ environment ];


// view engine setup
/*
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'jade');
*/
//app.use(reqLogger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', express.static('./client/'));
app.use('/', express.static('./'));

var request = require('request');

var gpio = undefined;
if (serverConfig.isRaspi) {
  log.info('Server configured as a raspberry pi. Loading gpio modules');
  gpio = require('pi-gpio');
}


var raspi = require('./action/raspi.js');
raspi = raspi(log4js, gpio, serverConfig.isRaspi);

var model = require('./model/model.js');
model = model(log4js, serverConfig.dbFile); //configure action
model.connect();

var notify = require('./notify/notify.js');
notify = notify(log4js, model);

var os = require('os');
var hostname = os.hostname();

var action = require('./action/action.js');
action = action(log4js, request, hostname, notify, raspi, model);

//Configure additional dependencies
model.setAction(action);
raspi.setStates(model.status);

raspi.openPins();

/**
 * set api routes up
 */
var api = require('./api/api.js');
api = api(log4js, express, model, notify);
app.use(api);

/**
 *
 * Status Codes
 *
 */

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  log.warn(req.originalUrl);
  log.warn('404 requested from ' + req.ip);
  err.status = 404;
  next(err);
});



/**
 *
 * Error Handlers
 *
 */
/*
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
*/

process.on('SIGINT', function() {
  log.info('CTRL C detected, exiting gracefully');
  raspi.closePins(function () {
    log.info('pins should be closed... exiting');
    process.exit();
  });
});

var server = app.listen(serverConfig.port, function () {
  log.info('lwefd listening on port '+ serverConfig.port)
});

module.exports = app;
