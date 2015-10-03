var model = (function () {
  var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');

  var db = null;

  var url = 'mongodb://localhost:27017/lwefd';
  var connect = function () {
      MongoClient.connect(url, function (err, connection) {
        assert.equal(null, err);
        console.log('connected to the server!');
        db = connection;
    });
  };

  var close = function() {
    db.close();
  };

  return {
    connect: connect,
    close: close
  }
})();

module.exports = model;