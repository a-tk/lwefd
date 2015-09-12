function Notify (log4js) {
  var log = log4js.getLogger('/notify');

  Notify.prototype.post = function (req, res, send) {
    log.info('posted');
    res.send('OK');
  }
}
module.exports = Notify;