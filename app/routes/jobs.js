var jobs = (function(log4js, express) {
  var log = log4js.getLogger('/jobs');
  var jobs = express.Router();

  jobs.get('/', function (req, res, next) {
    res.render('jobs/jobs',{title: 'New routing'});
  });

  return jobs;
});

module.exports = jobs;
