function NotificationHandler(log4js,
                             Notification,
                             NotificationParser,
                             NotificationQueue) {

  var log = log4js/getLogger('NotificationHandler');
  var notification = Notification,
    parser = NotificationParser,
    queue = NotificationQueue;

  NotificationHandler.prototype.handleNotification = function () {
    log.info('handleNotification callled');
  }
}

module.exports = NotificationHandler;