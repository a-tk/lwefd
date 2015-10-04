var model = (function () {
  var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');

  var db = null;
  var products = 'products';
  var jobs = 'jobs';

  var url = 'mongodb://localhost:27017/lwefd';
  var connect = function () {
      MongoClient.connect(url, function (err, connection) {
        assert.equal(null, err);
        console.log('connected to the server!');
        db = connection;
    });
  };

  var addProduct = function (id, name, displayName, callback) {
    db.collection(products).insertOne( {
      _id : id,
      name : name,
      displayName : displayName
    }, function (err, result) {
      assert.equal(null, err);
      console.log('added product');
      callback(result);
    });
  };

  var addRun = function (productId, name, status, callback) {
    db.collection(jobs).updateOne( {
      productId : productId,
      name : name,
      runs: [

      ]
    }, {
        $push : {
          runs : {
            date: Date.now(),
            status : status
          }
        }
      }, {upsert: true}).then(function (err, result) {
      assert.equal(null, err);
      console.log('added run');
      callback(result);
    });
  };

  var close = function() {
    db.close();
  };

  return {
    connect: connect,
    addProduct: addProduct,
    addRun : addRun,
    close: close
  }
})();

module.exports = model;