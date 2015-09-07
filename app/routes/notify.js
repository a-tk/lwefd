var log4js = require('log4js'),
  log = log4js.getLogger('routes/notify');

var express = require('express');
var router = express.Router();

var NotificationParser = require('../util/Notifications/NotificationParser'),
  notificationParser = new NotificationParser();

var NotificationController = require('../controllers/NotificationController'),
  notificationController = new NotificationController(notificationParser);

router.post('/', function (req, res) {
  try {

    log.info('POST received, passing request to NotificationController');
    var notification = notificationController.handleNotification(req);

  }catch(err) {

    log.error(err.message);
    log.error(err);

    res.status(500).send(err.message);
    return;
  }

  res.send('OK');
});
module.exports = router;