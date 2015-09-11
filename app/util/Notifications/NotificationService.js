var log4js = require('log4js'),
  log = log4js.getLogger('NotificationService');

function NotificationService () {

  if (arguments.callee._singletonInstance) {
    log.warn('Cannot instantiate more than one NotificationService');
    return arguments.callee._singletonInstance;
  }
  else {
    arguments.callee._singletonInstance = this;
    log.info('NotificationService created');

    //functions go here
    this.start = function () {
      log.info('NotificationService started');
    }
  }
}

module.exports = NotificationService;