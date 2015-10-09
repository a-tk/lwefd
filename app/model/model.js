var model = (function (log4js) {
  var log = log4js.getLogger('model');
  var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');

  var db = null;
  var products = 'products';
  var jobs = 'jobs';

  var url = 'mongodb://localhost:27017/lwefd';
  var connect = function () {
      MongoClient.connect(url, function (err, connection) {
        assert.equal(null, err);
        log.info('connected to the mongo server');
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
      _id: name,
      productId : productId
    }, {$push : {
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

  var getJob = function (callback) {
    log.warn('getJob not implemented');
    callback();
  };

  var getJobListing = function (callback) {
    log.warn('getJobListing not implemented');
    callback();
  };

  var getProduct = function (callback) {
    log.warn('getProduct not implemented');
    callback();
  };

  var outDB = function (callback) {
   db.collection(jobs).find().toArray().then(function (result) {
     callback(JSON.stringify(result));
   });
  };

  var close = function() {
    db.close();
  };

  return {
    connect: connect,
    addProduct: addProduct,
    addRun : addRun,
    getJob: getJob,
    getProduct: getProduct,
    getJobListing: getJobListing,
    outDB: outDB,
    close: close
  }
});

module.exports = model;