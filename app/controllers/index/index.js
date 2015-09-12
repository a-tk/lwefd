
function Index (log4js) {
  var log = log4js.getLogger('/');

  Index.prototype.get = function(req, res, next) {
    res.render('index', { title: 'Index'});
  }
}

module.exports = Index;
