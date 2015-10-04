var routes = (function(log4js, express, model) {
  var log = log4js.getLogger('/routes');
  var routes = express.Router();

  routes.get('/', function (req, res, next) {
    model.outDB(console.log);
    res.render('index',{title: 'New routing'});
  });

  routes.get('/:product/', function (req, res, next) {
    model.addProduct(1, req.params.product, 'TESTING', console.log);
    res.send('got ' + req.params.product);
  });

  routes.get('/:product/notify/', function (req, res, next) {
    res.send('got ' + req.params.product);
  });

  routes.post('/:product/notify/', function (req, res, next) {
    res.send('got ' + req.params.product);
  });

  routes.get('/:product/jobs/', function (req, res, next) {
    res.send('got ' + req.params.product);
  });

  routes.get('/:product/jobs/:id/', function (req, res, next) {
    model.addRun(req.params.product, 'Test Job', 'SUCCESS', console.log);
    res.send('got ' + req.params.product + ' and id ' + req.params.id);
  });

  return routes;
});

module.exports = routes;
