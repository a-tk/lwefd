var routes = (function(log4js, express) {
  var log = log4js.getLogger('/routes');
  var routes = express.Router();

  routes.get('/', function (req, res, next) {
    res.render('index',{title: 'New routing'});
  });

  routes.get('/jobs', function (req, res, next) {
    res.render('jobs/jobs',{title: 'New routing'});
  });

  routes.post('/notify', function(req,res, next) {
    res.send('POST received\n');
  });

  return routes;
});

module.exports = routes;
