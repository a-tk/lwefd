var model = (function (log4js) {
  var log = log4js.getLogger('model');

  var DbClient = require('sqlite3').verbose(),
    dbfile = ':memory:',
    assert = require('assert');

  var db = null;

  var connect = function () {
    db = new DbClient.Database(dbfile, function(err) {
      if (err) {
        log.fatal('Could not connect to DB: ' + dbfile);
      } else {
        log.info('Model connected to ' + dbfile);
        initialize();
      }
    });
  };

  var initialize = function() {
    var createProductTable = 'CREATE TABLE IF NOT EXISTS products ' +
      '(' +
      'id INTEGER PRIMARY KEY AUTOINCREMENT, ' +
      'name VARCHAR(64) NOT NULL UNIQUE, ' +
      'numFailed INTEGER NOT NULL DEFAULT 0, ' +
      'numUnstable INTEGER NOT NULL DEFAULT 0' +
      ');';
    var createJobTable = 'CREATE TABLE IF NOT EXISTS jobs ' +
      '(' +
      'id INTEGER PRIMARY KEY AUTOINCREMENT, ' +
      'productId INTEGER NOT NULL, ' +
      'name VARCHAR(64) NOT NULL DEFAULT "NO_NAME_PROVIDED" UNIQUE, ' +
      'FOREIGN KEY(productId) REFERENCES products(id)' +
      ');';
    var createRunTable = 'CREATE TABLE IF NOT EXISTS runs ' +
      '(' +
      'id INTEGER PRIMARY KEY AUTOINCREMENT, ' +
      'jobId INTEGER NOT NULL, ' +
      'status VARCHAR(16) NOT NULL, ' +
      'FOREIGN KEY(jobId) REFERENCES jobs(id)' +
      ');';

    db.run(createProductTable, function(err) {
      if (err) {
        log.fatal('cannot add table products');
      } else {
        log.info('added products table')
      }
    });
    db.run(createJobTable, function(err) {
      if (err) {
        log.fatal('cannot add jobs');
      } else {
        log.info('added jobs table')
      }
    });
    db.run(createRunTable, function(err) {
      if (err) {
        log.fatal('cannot add runs');
      } else {
        log.info('added runs table')
      }
    });
  };

  var addProduct = function (name, callback) {
    var sql = 'INSERT INTO products ' +
      '(' +
      'name' +
      ') ' +
      'VALUES ' +
      '("' +
      name +
      '");';
    console.log(sql);
    db.run(sql, function(err) {
        if (err) {
          log.warn('could not add product ' + name);
        }
        callback(err);
      }
      );

  };

  var addRun = function (productId, jobName, status, callback) {
    //if first entry, add job, then add run, otherwise just add run
    var checkQuery = 'SELECT id FROM ' +
      'jobs ' +
      'WHERE ' +
      'productId=' + productId + ', ' +
      'name="' + jobName + '"' +
      ';';

    db.all(checkQuery, function(err, result) {
      //TODO:inc and dec counters in products table
      if (!err) {
        if (result) {
          //there is already a job entry, so add a run
          var runEntry = 'INSERT INTO runs ' +
            '(' +
            'jobID, ' +
            'status' +
            ') VALUES (' +
            result[0].id + ', ' +
            '"' + status + '"' +
            ');';
          db.run(runEntry, function(err) {
            if (err) {
              log.warn('could not add run: ' + err);
            }
            callback(err);
          });
        } else {
          //add a job entry, then add a run
          addJobEntry(productId, jobName, function (jobId) {
            var runEntry = 'INSERT INTO runs ' +
              '(' +
              'jobID, ' +
              'status' +
              ') VALUES (' +
              jobId + ', ' +
              '"' + status + '"' +
              ');';
            db.run(runEntry, function(err) {
              if (err) {
                log.warn('could not add run: ' + err);
              }
              callback(err);
            });
          });
        }
      } else {
        log.warn('could not add run: ' + err);
        callback(err);
      }
    });
  };

  var addJobEntry = function (productId, jobName, callback) {
    var jobEntry = 'INSERT INTO jobs ' +
      '(' +
      'productId, ' +
      'name' +
      ') VALUES (' +
      productId + ', ' +
      '"' + jobName + '" ' +
      ');';
    db.run(jobEntry, function(err) {
      if (!err) {
        var id;
        if (this.lastID) {
          id = this.lastID;
        } else {
          id = 0; // never present id
        }
        callback(id);
      } else {
        log.warn('adding job entry failed: ' + err);
      }
    });

  };

  var getJobRuns = function (jobId, callback) {
    var runQuery = 'SELECT * FROM runs ' +
      'WHERE ' +
      'jobId=' + jobId + '' +
      ';';

    db.all(runQuery, function (err, result) {
      if (!err) {
        callback(result);
      } else {
        log.warn('could not getJobRuns for jobId ' + jobId);
        callback([]);
      }
    });
  };

  var getAllJobs = function (productId, callback) {
    var jobQuery = 'SELECT * FROM jobs ' +
      'WHERE ' +
      'productId=' + productId + '' +
      ';';

    db.all(jobQuery, function (err, result) {
      if (!err) {
        callback(result);
      } else {
        log.warn('could not getAllJobs for productId ' + productId);
        callback([]);
      }
    });
  };

  var getProduct = function (callback) {
    var productQuery = 'SELECT * FROM products ' +
      'WHERE 1;';

    db.all(productQuery, function (err, result) {
      if (!err) {
        callback(result);
      } else {
        log.warn('could not getProducts: ' + err);
        callback([]);
      }
    });
  };

  var outDB = function (callback) {
    db.all('SELECT * FROM products WHERE 1;', function(err, result) {
      console.log(err + '' + result);
      callback(result);
    });
  };

  var close = function() {
    db.close(function (err) {
      if (err) {
        log.fatal('could not close DB');
      }
    });
  };

  return {
    connect: connect,
    addProduct: addProduct,
    addRun : addRun,
    getJobRuns: getJobRuns,
    getProduct: getProduct,
    getAllJobs: getAllJobs,
    outDB: outDB,
    close: close
  }
});

module.exports = model;