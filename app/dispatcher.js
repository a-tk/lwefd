
var dispatcher = function(fs, log4js) {
  var log = log4js.getLogger('dispatcher');
  //TODO: allow dynamic loading of di.json.

  var getDependencies = function(dependencies) {

    var dependencyList = {};
    console.log(JSON.stringify(dependencies));
    try {
      for (var dependency in dependencies) {
        if (dependencies.hasOwnProperty(dependency)) {
          console.log(JSON.stringify(dependency));
          console.log(" path? " + dependencies[dependency]);
          dependencyList[dependency] = require(dependencies[dependency]);
          console.log(JSON.stringify(dependencyList));
        }
      }
    } catch (err) {
      log.error(err);
    }

    return dependencyList;
  };

  var dispatcher =  function (req, res, next) {
    var diContainer = JSON.parse(fs.readFileSync('./di.json', 'utf8'));
    var requestRoute = req.originalUrl;

    if (diContainer.hasOwnProperty(requestRoute)) {
      var routedPage = new (require(diContainer[requestRoute]["controller"]))(log4js);
      var method = req.method.toLowerCase();

      var dependencies;

      if (diContainer[requestRoute].hasOwnProperty('dependsOn')) {
        dependencies = getDependencies(diContainer[requestRoute]['dependsOn']);
      }

      if (typeof routedPage[method] === 'function') {
        routedPage[method](req, res, next, dependencies);
      } else {
        res.sendStatus(404);
      }

    } else {
      res.sendStatus(404);
    }
  };

  return dispatcher;
};

module.exports = dispatcher;