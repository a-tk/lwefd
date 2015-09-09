var log4js = require('log4js'),
  log = log4js.getLogger('Notification Queue');
/*
function NotificationQueue () {

  if (arguments.callee._singletonInstance) {
    log.warn('Cannot instantiate more than one NotificationQueue');
    return arguments.callee._singletonInstance;
  }
  else {
    arguments.callee._singletonInstance = this;
    log.info('NotificationQueue Created');
    //functions go here
    //this.addNotification = function (notification) {
  }
}
*/

var NotificationQueue = function () {
  var log4js = require('log4js'),
    log = log4js.getLogger('NotificationQueue');

  return {
    //methods
  };
}();

module.exports = NotificationQueue;
