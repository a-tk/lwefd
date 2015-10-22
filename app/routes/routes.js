var routes = (function(log4js, express, model) {
  var log = log4js.getLogger('/routes');
  var routes = express.Router();

  routes.get('/api/', function (req, res, next) {
    //TODO: display all of the routes
    model.outDB(function (result) {
      res.render('index/api_index',{title: '/api/', data: result});
    });
  });

  routes.get('/api/:product/', function (req, res, next) {
    //TODO: display product info
    model.getProduct(req.params.product, function (result) {
      res.send(result);
    });
  });

  routes.get('/api/:product/create/:name', function (req, res, next) {
    //TODO: display product info
    model.addProduct(req.params.product, req.params.name ,function (result) {
      res.send(result);
    });
  });

  routes.get('/api/:product/notify/', function (req, res, next) {
    //TODO: doc on how to notify
    model.addRun(req.params.product, 'test job', 'SUCCESS', function (result) {
      res.send(result);
    });
  });

  routes.post('/api/:product/notify/', function (req, res, next) {
    //TODO: process notification
    model.getProduct(function (result) {
      res.send(result);
    });
  });

  routes.get('/api/:product/jobs/', function (req, res, next) {
    //TODO: view all jobs belonging to a product
    model.getJobListing(req.params.product, function (result) {
      res.send(result);
    });
  });

  routes.get('/api/:product/jobs/:id/', function (req, res, next) {
    //TODO: display all of the run information for a specific job
    model.getJob(req.params.product, req.params.id, function (result) {
      res.send(result);
    });
  });

  return routes;
});

module.exports = routes;
