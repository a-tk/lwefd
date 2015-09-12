var Jobs = function (log4js) {
  var log = log4js.getLogger('/jobs');

  Jobs.prototype.get = function (req, res, next) {
    res.render('jobs/jobs', {title: 'Jobs'});
  }
};

module.exports = Jobs;
