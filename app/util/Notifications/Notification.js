
var Notification = function () {
  return {
    test: function ($logger) {
      $logger.info('Notification.test');
    }
  };
}();

module.exports = Notification;
