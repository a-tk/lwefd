var index = function(log4js, express) {
  var log = log4js.getLogger('/jobs');
  var index = express.Router();

  index.get('/', function (req, res, next) {
    res.render('index',{title: 'New routing'});
  });

  return index;
};


module.exports = index;
