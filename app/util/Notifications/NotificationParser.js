

var NotificationParser = function () {
  var log4js = require('log4js'),
    log = log4js.getLogger('NotificationParser');
  return {
    parse: function (req) {
      log.info(JSON.stringify(req.body));
    }
  };
}();

module.exports = NotificationParser;