var action = (function (log4js, request, hostname, notify, raspi, model) {
  var log = log4js.getLogger('action');
  log.setLevel('INFO');

  var sendProductStatusNotification = function (productData) {
    var url = productData.forwardUrl;
    var productName = productData.name;
    var currentStatus = productData.currentStatus;
    var phase = model.phase.COMPLETED;
    var forwardCount = productData.forwardCount;

    var notification = notify.createNotification(productName, 'http://' + hostname, forwardCount, phase, currentStatus);

    request.post(url, {form:notification});
    model.updateForwardCount(productData.id, forwardCount + 1);

  };


  var updateRaspiLights = function (productData) {
    var relays = productData.relayMapping;

  };

  return {
    updateRaspiLights: updateRaspiLights,
    sendProductStatusNotification: sendProductStatusNotification
  }
});

module.exports = action;
