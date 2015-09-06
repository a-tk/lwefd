var log4js = require('log4js'),
  log = log4js.getLogger('Notification Queue');

function NotificationQueue () {
  log.info('NotificationQueue Created');

  if (arguments.callee._singletonInstance) {
    return arguments.callee._singletonInstance;
  }
  else {
    arguments.callee._singletonInstance = this;

    //functions go here
    //this.addNotification = function (notification) {
  }
}

module.exports = NotificationQueue;
