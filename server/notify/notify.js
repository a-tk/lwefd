
/*
This is what I expect a notification to look like.

{
  "name": "notification name",
  "valueUnit": "MPH", //for use in assigning a value to a notification, like on a performance run!
  "build": {
    "full_url": "http://something.com",
    "number": 13,
    "phase": "COMPLETED", //could be STARTED or COMPLETED,
    "status": "SUCCESS", //could be SUCCESS UNSTABLE or FAILURE
    "value": 0 //for use in assigning a value to a notification, like on a performance run!
  }
};
*/


var notify = (function (log4js, model) {
  var log = log4js.getLogger('notify');
  var queue = [];
  var polling = false;

  return {
    process: process
  };

  function process (productId, data, callback) {
    var notification = parseNotification(productId, data);
    push(notification);
    if (polling === false) {
      poll(callback);
    }
  }

  function parseNotification(productId, data) {
    var notification = {
      productId: productId
    };

    if (data !== undefined) {
      if (data.hasOwnProperty('name')) {
        notification.name = data.name;
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
        if (data.hasOwnProperty('value') && data.hasOwnProperty('valueUnit')) {
          notification.build.value = data.build.value;
          notification.build.valueUnit = data.build.valueUnit;
        }
      }
    }
  }

  function push(notification) {
    log.info('added notification to queue');
    queue.unshift(notification);
  }

  function poll(callback) {
    polling = true;
    var notification = queue.pop();
    model.addRun(notification, function () {
      if (notificationsInQueue()) {
        log.info('polling again');
        poll(callback);
      } else {
        log.info('polling done');
        polling = false;
        callback();
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

});

module.exports = notify;