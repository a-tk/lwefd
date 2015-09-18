function Notify (log4js) {
  var log = log4js.getLogger('/notify');


  Notify.prototype.post = function (req, res, next, dependencies) {
    console.log(JSON.stringify(dependencies));
    dependencies['NotificationHandler'].handleNotification();
    res.send('OK');
  }
}
module.exports = Notify;