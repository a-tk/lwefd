var model = (function (log4js) {
  var log = log4js.getLogger('model');

  //TODO: commenting out to try an in memory impl.
  /*var MongoClient = require('mongodb').MongoClient,
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
  };*/

  var db = {
    products: {

    }
  };

  var connect = function () {
    log.info('connected to virtual DB');
  };

  var addProduct = function (name, displayName, callback) {

    var newProduct = {
      displayName : displayName,
      jobs : {

      }
    };

    db.products[name] = newProduct;

    console.log(JSON.stringify(db));
    callback(JSON.stringify(newProduct));
  };

  var addRun = function (productName, jobName, status, callback) {

    if (!db.products.hasOwnProperty(productName)) {
      log.error('could not add run, product does not exist');
      callback(JSON.stringify(db));
      return;
    }

    var newRun = {
      date : Date.now(),
      status : status
    };

    if (!db.products[productName].jobs.hasOwnProperty(jobName)) {
      log.info('adding a new job');
      db.products[productName].jobs[jobName] = {
        runs : [

        ]
      };
    }

    db.products[productName].jobs[jobName].runs.push(newRun);

    console.log(JSON.stringify(db));
    callback(JSON.stringify(newRun));
  };

  var getJob = function (productName, jobName, callback) {
    var result = {};
    if (db.products.hasOwnProperty(productName)) {
      if (db.products[productName].jobs.hasOwnProperty(jobName)) {
        result = db.products[productName].jobs[jobName];
      }else {
        log.warn('requested job does not exist');
      }
    } else {
      log.warn('requested product does not exist');
    }
    callback(JSON.stringify(result));
  };

  var getJobListing = function (productName, callback) {
    var result = {};
    if (db.products.hasOwnProperty(productName)) {
      result = db.products[productName].jobs;
    } else {
      log.warn('requested product does not exist');
    }
    callback(JSON.stringify(result));
  };

  var getProduct = function (productName, callback) {
    var result = {};
    if (db.products.hasOwnProperty(productName)) {
      result = db.products[productName];
    } else {
      log.warn('requested product does not exist');
    }
    callback(JSON.stringify(result));
  };

  var outDB = function (callback) {
    callback(JSON.stringify(db));
  };

  var close = function() {
    log.info('DB closed');
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