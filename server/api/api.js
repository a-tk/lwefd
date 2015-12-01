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
  api.get('/api/:productId/', function (req, res, next) {
    //TODO: display product info
    model.getProducts(function (result) {
      res.send(result);
    });
  });

  api.get('/api/create/:productName', function (req, res, next) {
    //TODO: display product info
    model.addProduct(req.params.productName, function (result) {
      res.send(result);
    });
  });

  api.get('/api/update/productName/:productId/:productName', function (req, res, next) {
    model.updateProductName(req.params.productId, req.params.productName, function (result) {
      res.send(result);
    });
  });

  api.get('/api/delete/product/:productId', function (req, res, next) {
    model.deleteProduct(req.params.productId, function (result) {
      res.send(result);
    });
  });

  /*
  Tested a run of this, for stability and performance. Submitted 250,000
  notifications to the server, from localhost to localhost, and routinely
  say response times of under 10ms, with as little as 2ms, and highest I saw
  was 25ms. The system remained stable throughout this process, and I was
  even able to routinely open the runs tab. After they were submitted,
  I noticed that the query to gather runs from each job took about
  30 - 40ms, and about .5s to render on the frontend. I miagine the
  slow frontend is from Angular ordering.
   */
  api.get('/api/:productId/notify/', function (req, res, next) {
    res.send(JSON.stringify(api.stack));
  });

  api.post('/api/:productId/notify/', function (req, res, next) {
    notify.process(req.params.productId, req.body, function (result) {
      res.send(result);
    });
  });

  api.get('/api/:productId/jobs/', function (req, res, next) {
    //TODO: view all jobs belonging to a product
    model.getAllJobs(req.params.productId, function (result) {
      res.send(result);
    });
  });

  api.get('/api/:productId/jobs/:id/', function (req, res, next) {
    //TODO: display all of the run information for a specific job
    model.getJobRuns(req.params.id, function (result) {
      res.send(result);
    });
  });

  return api;
});

module.exports = api;
