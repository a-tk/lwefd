var log4js = require('log4js'),
  log = log4js.getLogger('NotificationParser');

function NotificationParser () {

  if (arguments.callee._singletonInstance) {
    log.warn('Cannot instantiate more than one NotificationParser');
    return arguments.callee._singletonInstance;
  }
  else {
    arguments.callee._singletonInstance = this;
    log.info('NotificationParser created');

    //functions go here
    this.parse = parse;
  }
}

var parse = function (req) {
  console.log(JSON.stringify(req.body));
};

module.exports = NotificationParser;