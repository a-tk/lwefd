var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('jobs/jobs', { title: 'Express' });
});

module.exports = router;
