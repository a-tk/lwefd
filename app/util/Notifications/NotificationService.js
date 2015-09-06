var log4js = require('log4js'),
  log = log4js.getLogger('NotificationService');

function NotificationService () {
  log.info('notification service created');
}

NotificationService.prototype = {
  start: function () {
    log.info('notification service started');
  }
};

module.exports = NotificationService;