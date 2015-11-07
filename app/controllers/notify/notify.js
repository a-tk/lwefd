var notify = (function (log4js, model) {
  var log = log4js.getLogger('notify');
  var queue = [];
  var polling = false;

  return {
    process: process
  };

  function process (productId, data) {
    var notification = parseNotification(productId, data);
    push(notification);
    if (polling === false) {
      poll();
    }
  }

  function parseNotification(productId, data) {
    var notification = {
      productId: productId
    };

    if (data) {
      if (data.hasOwnProperty('name')) {
        notification.name = data.name;
      }
      if (data.hasOwnProperty('url')) {
        notification.url = data.url;
      }
      if (data.hasOwnProperty('build')) {
        notification.build = {};
        if (data.hasOwnProperty('full_url')) {
          notification.build.full_url = data.build.full_url;
        }
        if (data.hasOwnProperty('number')) {
          notification.build.number = data.build.number;
        }
        if (data.hasOwnProperty('phase')) {
          notification.build.phase = data.build.phase;
        }
        if (data.hasOwnProperty('status')) {
          notification.build.status = data.build.status;
        }
      }
    }
  }

  function push(notification) {
    log.info('added notification to queue');
    queue.unshift(notification);
  }

  function poll() {
    polling = true;
    var notification = queue.pop();
    model.addRun(notification.productId, notification, function () {
      if (notificationsInQueue()) {
        log.info('polling again');
        poll();
      } else {
        log.info('polling done');
        polling = false;
      }
    });
  }

  function notificationsInQueue() {
    var result = false;
    if (queue.length !== 0) {
      result = true;
    }
    return result;
  }

})();

module.exports = notify;