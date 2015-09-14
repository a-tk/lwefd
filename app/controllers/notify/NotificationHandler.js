

var NotificationController = function () {
  var log4js = require('log4js'),
    log = log4js.getLogger('NotificationController');

  return {
    handleNotification: function (notificationParser, req) {
      log.info('handleNotification');
      notificationParser.parse(req);
    }
  };
}();

module.exports = NotificationController;