var api = (function (log4js, express, model, notify) {
  var log = log4js.getLogger('/api');
  var api = express.Router();
  var travis_ci = require('../notify/travis-ci.js')(log4js);


  /**
   *  url: /api
   *  method: GET
   *  result: returns an array of product information
   *    If there are no products, returns an empty array
   *    Product info JSON returned is id, name, forwardUrl, relayMapping,
   *    lastSuccess, forwardCount, and currentStatus for each product
   *
   *    [
   *      {
   *        "id" : 1,
   *        "name" : "something",
   *        "forwardUrl" : "",
   *        "forwardCount" : 267,
   *        "lastSuccess" : 1475678113822,
   *        "relayMapping" : "5,6",
   *        "currentStatus" : "SUCCESS"
   *      },
   *      { ... }
   *    ]
   */
  api.get('/api/', function (req, res, next) {
    model.getProducts(function (result) {
      res.send(JSON.stringify(result));
    });
  });


  /**
   *  url: /api/products
   *  method: GET
   *  result: returns an array of product information
   *    If there are no products, returns an empty array
   *    Product info JSON returned is id, name, forwardUrl, relayMapping,
   *    lastSuccess, forwardCount, and currentStatus for each product
   *
   *    [
   *      {
   *        "id" : 1,
   *        "name" : "something",
   *        "forwardUrl" : "",
   *        "forwardCount" : 267,
   *        "lastSuccess" : 1475678113822,
   *        "relayMapping" : "5,6",
   *        "currentStatus" : "SUCCESS"
   *      },
   *      { ... }
   *    ]
   */
  api.get('/api/products/', function (req, res, next) {
    model.getProducts(function (result) {
      res.send(JSON.stringify(result));
    });
  });


  /**
   *  url: /api/:productId
   *  method: GET
   *  result: Does not currently function as expected. Returns array of all products
   */
  api.get('/api/:productId/', function (req, res, next) {
    model.getProducts(function (result) {
      res.send(result);
    });
  });


  /**
   *  url: /api/create/:productName
   *  method: GET
   *  result: Creates a product entry that can then be notified, and utilized by lwefd
   *    Returns a JSON array with one object, that has one field, id,
   *    containing the new productId
   *
   *    [{"id": 1}]
   *
   */
  api.get('/api/create/:productName', function (req, res, next) {
    model.addProduct(req.params.productName, function (result) {
      res.send(result);
    });
  });


  /**
   *  url: /api/:productId/update/productName/:productName
   *  method: GET
   *  result: Product name is updated, no data is returned, unless upon error
   *    Does not error on productId that does not exist
   */
  api.get('/api/:productId/update/productName/:productName', function (req, res, next) {
    model.updateProductName(req.params.productId, req.params.productName, function (result) {
      res.send(result);
    });
  });


  /**
   *  url: /api/:productId/update/forwardUrl
   *  method: POST
   *  result: forwardUrl is updated, no content is returned unless upon error
   *    Does not error with a productId that does not exist
   *    Accepts:
   *    {
   *      "forwardUrl" : "http://"
   *    }
   */
  api.post('/api/:productId/update/forwardUrl', function (req, res, next) {
    model.updateForwardUrl(req.params.productId, req.body['forwardUrl'], function (result) {
      res.send(result);
    });
  });


  /**
   *  url: /api/:productId/update/relayMapping
   *  method: POST
   *  result: relayMapping is updated, no content is returned unless upon error
   *    Does not error with a productId that does not exist
   *    Accepts:
   *    {
   *      "relayMapping" : "5,6"
   *    }
   */
  api.post('/api/:productId/update/relayMapping', function (req, res, next) {
    model.updateRelayMapping(req.params.productId, req.body['relayMapping'], function (result) {
      res.send(result);
    });
  });


  /**
   *  url: /api/:productId/delete/product
   *  method: GET
   *  result: Delete the supplied product. Does not error on pid that does not exist
   */
  api.get('/api/:productId/delete/product', function (req, res, next) {
    model.deleteProduct(req.params.productId, function (result) {
      res.send(result);
    });
  });


  /**
   *  url: /api/:productId/delete/job/:jobId
   *  method: GET
   *  result: Delete the specified product's job.
   *    Does not error on non-existent ids
   */
  api.get('/api/:productId/delete/job/:jobId', function (req, res, next) {
    model.deleteJob(req.params.productId, req.params.jobId, function (result) {
      res.send(result);
    });
  });


  /**
   *  url: /api/:productId/delete/job/:jobId/run/:runId
   *  method: GET
   *  result: Delete the specified product's job's run.
   *    Does not error on non-existent ids
   */
  api.get('/api/:productId/delete/job/:jobId/run/:runId', function (req, res, next) {
    model.deleteRun(req.params.productId, req.params.jobId, req.params.runId, function (result) {
      res.send(result);
    });
  });


  /**
   *  url: /api/:productId/notify/
   *  method: GET
   *  result: GETting this url results in a JSON object overview of the entire API
   */
  api.get('/api/:productId/notify/', function (req, res, next) {
    res.send(JSON.stringify(api.stack, null, '\t'));
  });


  /**
   *  url: /api/:productId/notify/
   *  method: POST
   *  result: The heart of lwefd. Post a notification to the tracker
   *    See /server/notify/notify.js for accepted format.
   *    Errors horribly when bad data is supplied. Does not crash server however
   */
  api.post('/api/:productId/notify/', function (req, res, next) {
    notify.process(req.params.productId, req.body, function (result) {
      res.send(result);
    });
  });


  /**
   *  url: /api/:productId/notify/travis
   *  method: POST
   *  result: Notifier for travis CI formatted notifications.
   *    Currently not up to date
   */
  api.post('/api/:productId/notify/travis', function (req, res, next) {
    travis_ci.transform(req.body.payload, function (data) {
      notify.process(req.params.productId, data, function (result) {
        res.send(result);
      });
    });
  });


  /**
   *  url: /api/:productId/jobs/
   *  method: GET
   *  result: Returns array of JSON job objects
   *    Job Objects have id, productId, name, currentStatus,latestTime, full_url,
   *    valueUnit, lowerControlLimit, and upperControlLimit
   *
   *    [
   *      {
   *        "id" : 1,
   *        "name" : "timeToLoad",
   *        "productId" : 12,
   *        "full_url" : "http://something",
   *        "latestTime" : 1475678113822,
   *        "valueUnit" : "milliseconds",
   *        "lowerControlLimit" : 1000,
   *        "upperControlLimit" : 21000
   *      },
   *      { ... }
   *    ]
   *
   */
  api.get('/api/:productId/jobs/', function (req, res, next) {
    model.getAllJobs(req.params.productId, function (result) {
      res.send(result);
    });
  });


  /**
   *  url: /api/:productId/summary/
   *  method: GET
   *  result: returns a brief status summary of the product
   *    {
   *      "name" : "testProduct"
   *      "numSuccess" : 26,
   *      "numUnstable" : 14,
   *      "numFailure" : 1
   *    }
   */
  api.get('/api/:productId/summary/', function (req, res, next) {
    model.getProductSummary(req.params.productId, function (result) {
      res.send(result);
    });
  });


  /**
   *  url: /api/:productId/jobs/:id/
   *  method: GET
   *  result: returns array of ALL the runs associated with the job
   *    object contains id, jobId, time, full_url, number, status, value, productId
   *
   *    [
   *      {
   *        "id" : 1,
   *        "jobId" : 16,
   *        "productId" : 12,
   *        "full_url" : "http://something",
   *        "time" : 1475678113822,
   *        "value" : 42,
   *        "number" : 1000,
   *        "status" : "SUCCESS"
   *      },
   *      { ... }
   *    ]
   */
  api.get('/api/:productId/jobs/:id/', function (req, res, next) {
    model.getJobRuns(req.params.id, function (result) {
      res.send(result);
    });
  });


  /**
   *  url: /api/:productId/update/controlLimits/:jobId
   *  method: POST
   *  result: update control limits on a specified product's job
   *    Accepts:
   *    {
   *      "upperControlLimit" : "42",
   *      "lowerControlLimit" : "12"
   *    }
   */
  api.post('/api/:productId/update/controlLimits/:jobId', function (req, res, next) {
    model.updateControlLimits(req.params.productId, req.params.jobId, req.body['upperControlLimit'], req.body['lowerControlLimit'], function (result) {
      res.send(result);
    });
  });


  /**
   *  url: /api/:productId/jobs/:id/:limit/
   *  method: GET
   *  result: returns array of :limit the runs associated with the job
   *    object contains id, jobId, time, full_url, number, status, value, productId
   *
   *    [
   *      {
   *        "id" : 1,
   *        "jobId" : 16,
   *        "productId" : 12,
   *        "full_url" : "http://something",
   *        "time" : 1475678113822,
   *        "value" : 42,
   *        "number" : 1000,
   *        "status" : "SUCCESS"
   *      },
   *      { ... }
   *    ]
   */
  api.get('/api/:productId/jobs/:id/:limit/', function (req, res, next) {
    model.getJobRunsLimited(req.params.id, req.params.limit, function (result) {
      res.send(result);
    });
  });

  return api;
});

module.exports = api;
