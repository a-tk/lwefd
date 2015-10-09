var routes = (function(log4js, express, model) {
  var log = log4js.getLogger('/routes');
  var routes = express.Router();

  routes.get('/', function (req, res, next) {
    //TODO: display all of the routes
    model.outDB(function (result) {
      res.render('index',{title: '/', data: result});
    });
  });

  routes.get('/:product/', function (req, res, next) {
    //TODO: display product info
    model.getProduct(function (result) {
      res.render('jobs/jobs',{title: '/:product/', data: result});
    });
  });

  routes.get('/:product/notify/', function (req, res, next) {
    //TODO: on how to notify
    res.send('got ' + req.params.product);
  });

  routes.post('/:product/notify/', function (req, res, next) {
    //TODO: process notification
    model.getProduct(function (result) {
      res.render('jobs/jobs',{title: '/:product/notify', data: result});
    });
  });

  routes.get('/:product/jobs/', function (req, res, next) {
    //TODO: view all jobs belonging to a product
    model.getJobListing(function (result) {
      res.render('jobs/jobs',{title: '/:product/jobs/', data: result});
    });
  });

  routes.get('/:product/jobs/:id/', function (req, res, next) {
    //TODO: display all of the run information for a specific job
    model.getJob(function (result) {
      res.render('jobs/jobs',{title: '/:product/jobs/:id', data: result});
    });
  });

  return routes;
});

module.exports = routes;
