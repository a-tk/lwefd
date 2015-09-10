
var NotificationService = function () {
  return {
    start: function ($logger) {
      $logger.info('NotificationService Started');
    }
  }
}();

module.exports = NotificationService;