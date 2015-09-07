var log4js = require('log4js'),
  log = log4js.getLogger('NotificationController');

var notificationParser;

function NotificationController (NotificationParser) {


  if (arguments.callee._singletonInstance) {
    log.warn('Cannot instantiate more than one NotificationController');
    return arguments.callee._singletonInstance;
  }
  else {
    arguments.callee._singletonInstance = this;
    notificationParser = NotificationParser;
    log.info('NotificationController created');

    //functions go here
    this.handleNotification = handleNotification;
  }
}

var handleNotification = function (req) {
  log.info('handleNotification');
  notificationParser.parse(req);
};


module.exports = NotificationController;