
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
  log.setLevel('WARN');
  var queue = [];
  var polling = false;

  return {
    process: process,
    createNotification: createNotification
  };

  /**
   * will build a notification accepted by this device
   * @param name - name/title of the notification
   * @param full_url - url to identify the notification
   * @param number - number of the build
   * @param phase - can be any of the items defined in model.js
   * @param status - can be any of the statuses defined in model.js
   * @param valueUnit - optional - to add a value to the notification
   * @param value - optional - to add a value to the notification
   * @returns {*}
   */

  function createNotification (name, full_url, number, phase, status, valueUnit, value) {
    var notification;

    if (valueUnit === undefined || value === undefined) {
      notification = {
        "name": name,
        "build": {
          "full_url": full_url,
          "number": number,
          "phase": phase,
          "status": status
        }
      };
    } else {
      notification = {
        "name": name,
        "valueUnit": valueUnit,
        "build": {
          "full_url": full_url,
          "number": number,
          "phase": phase,
          "status": status,
          "value": value
        }
      };
    }

    return notification;
  }

  function process (productId, data, callback) {
    var notification = parseNotification(productId, data);
    if (notification !== null) {
      push(notification, callback);
      if (polling === false) {
        poll();
      }
    } else {
      callback();
    }
  }

  function parseNotification(productId, data) {
    var notification = {
      productId: productId
    };

    if (data !== undefined &&
      data.hasOwnProperty('name') &&
      data.hasOwnProperty('build') &&
      data.build.hasOwnProperty('full_url') &&
      data.build.hasOwnProperty('number') &&
      data.build.hasOwnProperty('phase') && model.phase.hasOwnProperty(data.build.phase) //&&
      //data.build.hasOwnProperty('status') && model.status.hasOwnProperty(data.build.status)
    ) {
      notification.name = data.name;
      notification.build = {};
      notification.build.full_url = data.build.full_url;
      notification.build.number = data.build.number;
      //notification.build.phase = data.build.phase;
      if (!data.build.hasOwnProperty('status')) {
        //default to SUCCESS
        data.build.status = model.status.SUCCESS;
      }

      if (data.build.phase === model.phase.STARTED) {
        notification.build.status = model.phase.STARTED;
      } else {
        notification.build.status = data.build.status;
      }

      if (data.build.hasOwnProperty('value') && data.hasOwnProperty('valueUnit')) {
          notification.build.value = data.build.value;
          notification.valueUnit = data.valueUnit;
      } else {
        notification.build.value = null;
        notification.valueUnit = null;
      }

      return notification;
    } else {
      log.warn('notification does not have all required fields, aborting insert');
      print_parse_trace(data);
      return null;
    }
  }

  function print_parse_trace (data) {
    log.warn(JSON.stringify(data));
    log.warn('data: ' + (data !== undefined));
    log.warn('has name ' + data.hasOwnProperty('name'));
    log.warn('has build ' + data.hasOwnProperty('build'));
    log.warn('has full_url ' + data.build.hasOwnProperty('full_url'));
    log.warn('has number ' + data.build.hasOwnProperty('number'));
    log.warn('has phase ' + (data.build.hasOwnProperty('phase') && model.phase.hasOwnProperty(data.build.phase)));
    log.warn('has status ' + (data.build.hasOwnProperty('status') && model.status.hasOwnProperty(data.build.status)));
  }


  function push(notification, callback) {
    log.info('added notification to queue');
    var queueItem = {
      'notification': notification,
      'callback': callback
    };
    queue.unshift(queueItem);
  }

  function poll() {
    polling = true;
    var queueItem = queue.pop();
    var notification = queueItem.notification;
    var callback = queueItem.callback;
    model.addRun(notification, function (result) {
      if (notificationsInQueue()) {
        log.info('polling again');
        callback(result);
        poll();
      } else {
        log.info('polling done');
        model.updateProductsStatus(function () {
          polling = false;
          callback(result);
        });
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
