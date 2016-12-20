var action = (function (log4js, request, hostname, notify, raspi, model) {
  var log = log4js.getLogger('action');
  log.setLevel('INFO');

  var sendProductStatusNotification = function (productData) {
    if (productData && productData.forwardUrl && productData.name && productData.currentStatus
        && productData.forwardCount && productData.id) {

      var url = productData.forwardUrl;
      var productName = productData.name;
      var currentStatus = productData.currentStatus;
      var phase = model.phase.COMPLETED;
      var forwardCount = productData.forwardCount;

      var notification = notify.createNotification(productName, 'http://' + hostname, forwardCount, phase, currentStatus);

      request.post(url, {form: notification});
      model.updateForwardCount(productData.id, forwardCount + 1);
    }
  };


  var updateRaspiLights = function (productData) {
    if (raspi !== undefined && raspi !== null) {
      if (productData && productData.relayMapping && productData.currentStatus) {
        var relays = productData.relayMapping.split(',');
        var relayZero = parseInt(relays[0]);
        var relayOne = parseInt(relays[1]);
        if (relays.length === 2 && !(relayZero !== relayZero) && !(relayOne !== relayOne)) {
          var currentStatus = productData.currentStatus;
          //log.warn(JSON.stringify(relays));

          raspi.setRelaysToStatus(relayZero, relayOne, currentStatus);
        }
      }
    }
  };

  return {
    updateRaspiLights: updateRaspiLights,
    sendProductStatusNotification: sendProductStatusNotification
  }
});

module.exports = action;
