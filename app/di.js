
var di = function(fs, log4js) {
  var log = log4js.getLogger('di');
  //TODO: allow dynamic loading of di.json.

  var dispatcher =  function (req, res, next) {
    var diContainer = JSON.parse(fs.readFileSync('./di.json', 'utf8'));
    var requestRoute = req.originalUrl;

    if (diContainer.hasOwnProperty(requestRoute)) {
      var routedPage = new (require(diContainer[requestRoute].route))(log4js);
      var method = req.method.toLowerCase();

      if (typeof routedPage[method] === 'function') {
        routedPage[method](req, res, next);
      } else {
        res.sendStatus(404);
      }

    } else {
      res.sendStatus(404);
    }
  };

  return dispatcher;
};

module.exports = di;