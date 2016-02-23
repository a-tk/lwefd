var api = (function (log4js, express, model, notify) {
  var log = log4js.getLogger('/api');
  var api = express.Router();
  var travis_ci = require('../notify/travis-ci.js')(log4js);

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


  api.post('/api/update/forwardUrl/:productId', function (req, res, next) {
    model.updateForwardUrl(req.params.productId, req.body['forwardUrl'], function (result) {
      res.send(result);
    });
  });

  api.post('/api/update/relayMapping/:productId', function (req, res, next) {
    model.updateRelayMapping(req.params.productId, req.body['relayMapping'], function (result) {
      res.send(result);
    });
  });

  api.get('/api/delete/product/:productId', function (req, res, next) {
    model.deleteProduct(req.params.productId, function (result) {
      res.send(result);
    });
  });

  api.get('/api/:productId/delete/job/:jobId', function (req, res, next) {
    model.deleteJob(req.params.productId, req.params.jobId, function (result) {
      res.send(result);
    });
  });

  api.get('/api/:productId/delete/job/:jobId/run/:runId', function (req, res, next) {
    model.deleteRun(req.params.productId, req.params.jobId, req.params.runId, function (result) {
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
    res.send(JSON.stringify(api.stack, null, '\t'));
  });

  api.post('/api/:productId/notify/', function (req, res, next) {
    notify.process(req.params.productId, req.body, function (result) {
      res.send(result);
    });
  });

  api.post('/api/:productId/notify/travis', function (req, res, next) {
    travis_ci.transform(req.body.payload, function (data) {
      notify.process(req.params.productId, data, function (result) {
        res.send(result);
      });
    });
  });

  api.get('/api/:productId/jobs/', function (req, res, next) {
    //TODO: view all jobs belonging to a product
    model.getAllJobs(req.params.productId, function (result) {
      res.send(result);
    });
  });

  api.get('/api/:productId/summary/', function (req, res, next) {
    //TODO: view all jobs belonging to a product
    model.getProductSummary(req.params.productId, function (result) {
      res.send(result);
    });
  });

  api.get('/api/:productId/jobs/:id/', function (req, res, next) {
    model.getJobRuns(req.params.id, function (result) {
      res.send(result);
    });
  });
  // Returns a limited list of the most recent jobs for job id
  api.get('/api/:productId/jobs/:id/:limit/', function (req, res, next) {
    model.getJobRunsLimited(req.params.id, req.params.limit, function (result) {
      res.send(result);
    });
  });

  return api;
});

module.exports = api;
