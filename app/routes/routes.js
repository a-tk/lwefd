var routes = (function (log4js, express, model) {
  var log = log4js.getLogger('/routes');
  var routes = express.Router();

  routes.get('/api/', function (req, res, next) {
    //TODO: display all of the routes
    model.getProducts(function (result) {
      res.render('index/api_index', {title: '/api/', data: JSON.stringify(result)});
    });
  });

  routes.get('/api/products/', function (req, res, next) {
    model.getProducts(function (result) {
      res.send(result);
    });
  });

  //TODO: make this consistent based on ID
  routes.get('/api/:product/', function (req, res, next) {
    //TODO: display product info
    model.getProducts(function (result) {
      res.send(result);
    });
  });

  routes.post('/api/create/:product', function (req, res, next) {
    //TODO: display product info
    model.addProduct(req.params.product, function (result) {
      res.send(result);
    });
  });

  routes.get('/api/:productId/notify/', function (req, res, next) {
    //TODO: doc on how to notify
    model.addRun(req.params.productId, 'test job', 'SUCCESS', function (result) {
      res.send(result);
    });
  });

  routes.post('/api/:product/notify/', function (req, res, next) {
    //TODO: process notification by adding to queue
    model.getProducts(function (result) {
      res.send(result);
    });
  });

  routes.get('/api/:product/jobs/', function (req, res, next) {
    //TODO: view all jobs belonging to a product
    model.getAllJobs(req.params.product, function (result) {
      res.send(result);
    });
  });

  routes.get('/api/:product/jobs/:id/', function (req, res, next) {
    //TODO: display all of the run information for a specific job
    model.getJobRuns(req.params.id, function (result) {
      res.send(result);
    });
  });

  return routes;
});

module.exports = routes;
