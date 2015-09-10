

var NotificationParser = function () {
  return {
    parse: function ($logger, $request) {
      $logger.info(JSON.stringify($request.body));
    }
  };
}();

module.exports = NotificationParser;