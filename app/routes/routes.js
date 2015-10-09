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
    model.getProduct(req.params.product, function (result) {
      res.render('jobs/jobs',{title: '/' + req.params.product + '/', data: result});
    });
  });

  routes.get('/:product/create/:name', function (req, res, next) {
    //TODO: display product info
    model.addProduct(req.params.product, req.params.name ,function (result) {
      res.render('jobs/jobs',{title: '/'+req.params.product+'/create/' + req.params.name, data: result});
    });
  });

  routes.get('/:product/notify/', function (req, res, next) {
    //TODO: doc on how to notify
    model.addRun(req.params.product, 'test job', 'SUCCESS', function (result) {
      res.render('jobs/jobs',{title: '/'+req.params.product+'/notify', data: result});
    });
  });

  routes.post('/:product/notify/', function (req, res, next) {
    //TODO: process notification
    model.getProduct(function (result) {
      res.render('jobs/jobs',{title: '/'+req.params.product+'/notify', data: result});
    });
  });

  routes.get('/:product/jobs/', function (req, res, next) {
    //TODO: view all jobs belonging to a product
    model.getJobListing(req.params.product, function (result) {
      res.render('jobs/jobs',{title: '/' + req.params.product + '/jobs/', data: result});
    });
  });

  routes.get('/:product/jobs/:id/', function (req, res, next) {
    //TODO: display all of the run information for a specific job
    model.getJob(req.params.product, req.params.id, function (result) {
      res.render('jobs/jobs',{title: '/'+req.params.product +'/jobs/'+req.params.id, data: result});
    });
  });

  return routes;
});

module.exports = routes;
