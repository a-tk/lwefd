var api = (function (log4js, express, model, notify) {
  var log = log4js.getLogger('/api');
  var api = express.Router();

  api.get('/api/', function (req, res, next) {
    //TODO: display all of the api
    model.getProducts(function (result) {
      res.send(JSON.stringify(result));
    });
  });

  api.get('/api/products/', function (req, res, next) {
    model.getProducts(function (result) {
      res.send(JSON.stringify(result));
    });
  });

  //TODO: make this consistent based on ID
  api.get('/api/:product/', function (req, res, next) {
    //TODO: display product info
    model.getProducts(function (result) {
      res.send(result);
    });
  });

  api.post('/api/create/:product', function (req, res, next) {
    //TODO: display product info
    model.addProduct(req.params.product, function (result) {
      res.send(result);
    });
  });

  api.get('/api/:productId/notify/', function (req, res, next) {
    //TODO: doc on how to notify
    model.addRun(req.params.productId, 'test job', 'SUCCESS', function (result) {
      res.send(result);
    });
  });

  api.post('/api/:product/notify/', function (req, res, next) {
    //TODO: process notification by adding to queue
    model.getProducts(function (result) {
      res.send(result);
    });
  });

  api.get('/api/:product/jobs/', function (req, res, next) {
    //TODO: view all jobs belonging to a product
    model.getAllJobs(req.params.product, function (result) {
      res.send(result);
    });
  });

  api.get('/api/:product/jobs/:id/', function (req, res, next) {
    //TODO: display all of the run information for a specific job
    model.getJobRuns(req.params.id, function (result) {
      res.send(result);
    });
  });

  return api;
});

module.exports = api;
