var model = (function (log4js, dbFile) {
  var log = log4js.getLogger('model');

  var DbClient = require('sqlite3').verbose(),
    assert = require('assert');

  var db = null;

  var status = {
    SUCCESS: "SUCCESS",
    FAILURE: "FAILURE",
    UNSTABLE: "UNSTABLE"
  };
  var phase = {
    STARTED: "STARTED",
    COMPLETED: "COMPLETED"
  };

  var productIdQueue = {};
  var polling = false;

  var connect = function () {
    db = new DbClient.Database(dbFile, function (err) {
      if (err) {
        log.fatal('Could not connect to DB: ' + dbFile);
      } else {
        log.info('Model connected to ' + dbFile);
        initialize();
      }
    });
  };

  var initialize = function () {
    var createProductTable = 'CREATE TABLE IF NOT EXISTS products ' +
      '(' +
      'id INTEGER PRIMARY KEY AUTOINCREMENT, ' +
      'name TEXT NOT NULL UNIQUE, ' +
      'currentStatus TEXT NOT NULL DEFAULT "' + status.SUCCESS + '" ' +
      ');';
    var createJobTable = 'CREATE TABLE IF NOT EXISTS jobs ' +
      '(' +
      'id INTEGER PRIMARY KEY AUTOINCREMENT, ' +
      'productId INTEGER NOT NULL, ' +
      'name TEXT NOT NULL DEFAULT "NO_NAME_PROVIDED", ' +
      'currentStatus TEXT NOT NULL DEFAULT "' + status.SUCCESS + '", ' +
      'latestTime INTEGER, ' +
      'full_url TEXT, ' +
      'valueUnit TEXT NOT NULL DEFAULT "NULL", ' +
      'FOREIGN KEY(productId) REFERENCES products(id)' +
      ');';
    var createRunTable = 'CREATE TABLE IF NOT EXISTS runs ' +
      '(' +
      'id INTEGER PRIMARY KEY AUTOINCREMENT, ' +
      'jobId INTEGER NOT NULL, ' +
      'time INTEGER NOT NULL, ' +
      'full_url TEXT NOT NULL, ' +
      'number INTEGER NOT NULL, ' +
      'status TEXT NOT NULL, ' +
      'phase TEXT NOT NULL, ' +
      'value INTEGER, ' +
      'FOREIGN KEY(jobId) REFERENCES jobs(id)' +
      ');';

    db.run(createProductTable, function (err) {
      if (err) {
        log.fatal('cannot add table products: ' + err);
      } else {
        log.info('added products table')
      }
    });
    db.run(createJobTable, function (err) {
      if (err) {
        log.fatal('cannot add jobs: ' + err);
      } else {
        log.info('added jobs table')
      }
    });
    db.run(createRunTable, function (err) {
      if (err) {
        log.fatal('cannot add runs: ' + err);
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
    db.run(sql, function (err) {
        if (err) {
          log.warn('error adding product ' + name + ': ' + err);
        }
        getProductIdForName(name, callback);
      }
    );
  };

  var updateProductName = function (id, name, callback) {

    var sql = 'UPDATE products SET ' +
      'name=' +
      '"' +
      name +
      '" ' +
      'WHERE ' +
      ' id='+ id +
      ';';
    db.run(sql, function (err) {
        if (err) {
          log.warn('error updating product ' + name + ': ' + err);
        }
        callback(err);
      }
    );
  };

  var deleteProduct = function (id, callback) {

    var sql = 'DELETE FROM products ' +
      'WHERE ' +
      ' id='+ id +
      ';';
    db.run(sql, function (err) {
        if (err) {
          log.warn('error deleting product ' + id + ': ' + err);
        }
        callback(err);
      }
    );
  };

  var deleteJob = function (pid, jid, callback) {

    var sql = 'DELETE FROM jobs ' +
      'WHERE ' +
      ' id='+ jid +
      ';';
    db.run(sql, function (err) {
        if (err) {
          log.warn('error deleting job ' + jid + ': ' + err);
        }
        pushProductId(pid);
        pollProductUpdateQueue(callback);
      }
    );
  };

  var deleteRun = function (id, callback) {

    var sql = 'DELETE FROM runs ' +
      'WHERE ' +
      ' id='+ id +
      ';';
    db.run(sql, function (err) {
        if (err) {
          log.warn('error deleting run ' + name + ': ' + err);
        }
        callback(err);
      }
    );
  };

  var getProductName = function (id, callback) {
    var selectName = 'SELECT name FROM ' +
      'products ' +
      'WHERE ' +
      'id="' + id + '" ' +
      ';';
    db.all(selectName, function (err, result) {
      if (err) {
        log.warn('error getting product name for id ' + id);
        callback(err);
      } else {
        callback(result[0]);
      }
    });
  };

  var getProductIdForName = function (name, callback) {
    var selectId = 'SELECT id FROM ' +
      'products ' +
      'WHERE ' +
      'name="' + name + '" ' +
      ';';
    db.all(selectId, function (err, result) {
      if (err) {
        log.warn('error getting product ID for name ' + name);
        callback(err);
      } else {
        callback(result);
      }
    });
  };

  var addRun = function (notification, callback) {
    //if first entry, add job, then add run, otherwise just add run

    var checkQuery = 'SELECT * FROM ' +
      'jobs ' +
      'WHERE ' +
      'productId=' + notification.productId + ' AND ' +
      'name="' + notification.name + '"' +
      ';';

    db.all(checkQuery, function (err, result) {
      var time = Date.now();
      if (!err) {
        if (result.length !== 0) {
          //there is already a job entry, so add a run
          var runEntry = 'INSERT INTO runs ' +
            '(' +
            'jobId, ' +
            'time, ' +
            'full_url, ' +
            'number, ' +
            'phase, ' +
            'status ' +
            ((notification.build.value !== null) ? ', value ':'') +
            ') VALUES (' +
            result[0].id + ', ' +
            time + ', ' +
            '"' + notification.build.full_url + '", ' +
            notification.build.number + ', ' + //will cause an issue if number is undefined.
            '"' + notification.build.phase + '", ' +
            '"' + notification.build.status + '" ' +
            ((notification.build.value !== null) ? ', ' + notification.build.value + ' ':'') +
            ');';
          //log.info(runEntry);
          db.run(runEntry, function (err) {
            if (err) {
              log.warn('could not add run [1]: ' + err);
              callback(err);
            } else {
              pushProductId(notification.productId);
              updateJobFromRun(result[0].id, time, notification.build.full_url, notification.build.status, callback);
            }
          });
        } else {
          //add a job entry, then add a run
          addJobEntry(notification, function (jobId) {
            var runEntry = 'INSERT INTO runs ' +
              '(' +
              'jobId, ' +
              'time, ' +
              'full_url, ' +
              'number, ' +
              'phase, ' +
              'status ' +
              ((notification.build.value !== null) ? ', value ':'') +
              ') VALUES (' +
              jobId + ', ' +
              time + ', ' +
              '"' + notification.build.full_url + '", ' +
              notification.build.number + ', ' +
              '"' + notification.build.phase + '", ' +
              '"' + notification.build.status + '" ' +
              ((notification.build.value !== null) ? ', ' + notification.build.value + ' ':'') +
              ');';
            //log.info(runEntry);
            db.run(runEntry, function (err) {
              if (err) {
                log.warn('could not add run [2]: ' + err);
                callback(err);
              } else {
                pushProductId(notification.productId);
                updateJobFromRun(jobId, time, notification.build.full_url, notification.build.status, callback);
              }
            });
          });
        }
      } else {
        log.warn('could not add run [3]: ' + err);
        callback(err);
      }
    });
  };

  var updateJobFromRun = function (jid, time, url, status, callback) {

    var sql = 'UPDATE jobs SET ' +
      'latestTime=' +
      '' +
      time +
      ', ' +
      'full_url=' +
      '"' +
      url +
      '",' +
      'currentStatus=' +
      '"' +
      status +
      '" '+
      'WHERE ' +
      ' id='+ jid +
      ';';
    db.run(sql, function (err) {
        if (err) {
          log.warn('error updating job ' + jid + ' to run ' + time +', '+ url+ ', '+ status + ': ' + err);
          callback(err);
        } else {
          callback();
        }
      }
    );
  };

  var addJobEntry = function (notification, callback) {
    var jobEntry = 'INSERT INTO jobs ' +
      '(' +
      'productId, ' +
      'name' +
      ((notification.valueUnit !== undefined && notification.valueUnit !== null) ? ', valueUnit ':'') +
      ') VALUES (' +
      notification.productId + ', ' +
      '"' + notification.name + '" ' +
      ((notification.valueUnit !== undefined && notification.valueUnit !== null) ? ', "' + notification.valueUnit + '" ':'') +
      ');';
    db.run(jobEntry, function (err) {
      if (!err) {
        var id;
        if (this.lastID) {
          id = this.lastID;
        } else {
          id = -1; // never present id
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
        callback();
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

  var getProducts = function (callback) {
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

  var close = function () {
    db.close(function (err) {
      if (err) {
        log.fatal('could not close DB');
      }
    });
  };

  var getJobsCountByStatus = function (pid, callback) {
    var sql = 'SELECT ' +
      'SUM(CASE WHEN currentStatus="UNSTABLE" THEN 1 else 0 end) numUnstable, ' +
      'SUM(CASE WHEN currentStatus="FAILURE" THEN 1 else 0 end) numFailed ' +
      'FROM jobs ' +
      'WHERE ' +
      'productId=' + pid +
      ';';

    db.all(sql, function (err, result) {
      if (!err) {
        callback(result[0].numUnstable, result[0].numFailed);
        //log.fatal(jid + ' jid: result = ' + JSON.stringify(result));
      } else {
        log.warn('could not getJobsCountByStatus: ' + err);
        //callback([]);
      }
    });
  };

  var getRunsStatus = function (jid, callback) {
    var sql = 'SELECT ' +
      'status ' +
      'FROM runs ' +
      'WHERE ' +
      'time= (SELECT MAX(TIME) FROM runs WHERE jobId='+jid+') ' +
      'AND ' +
      'jobId=' + jid +
      ';';

    db.all(sql, function (err, result) {
      if (!err) {
        //log.fatal('result = ' +JSON.stringify(result));
        callback(jid, result[0].status);
      } else {
        log.warn('could not getRunsStatus: ' + err);
        //callback([]);
      }
    });

  };

  var updateProductsStatus = function (callback) {
    if (polling == false) {
      pollProductUpdateQueue(callback);
    } else {
      callback();
    }
  };

  var pollProductUpdateQueue = function (callback) {
    if (productIdsInQueue()) {
      polling = true;
      var pid = popProductId();
      getJobsCountByStatus(pid, function (numUnstable, numFailed) {
        var statusToSet;
        if (numFailed > 0) {
          log.info('setting pid ' + pid + ' to failed');
          statusToSet = status.FAILURE;
        } else if (numUnstable > 0) {
          log.info('setting pid ' + pid + ' to unstable');
          statusToSet = status.UNSTABLE;
        } else {
          log.info('setting pid ' + pid + ' to success');
          statusToSet = status.SUCCESS;
        }
        setProductToStatus(pid, statusToSet, callback, pollProductUpdateQueue);
      });
    } else {
      polling = false;
      callback();
    }
  };

  var productIdsInQueue = function () {
    var size = Object.keys(productIdQueue).length;
    return size !== 0;
  };

  /*
  Stack methods, but actually functions as a queue
   */
  var pushProductId = function (pid) {
    if (!productIdQueue.hasOwnProperty(pid)) {
      productIdQueue[pid] = pid;
      //log.info('added pid ' + pid + ' to queue');
    }
  };

  var popProductId = function () {
    var keys = Object.keys(productIdQueue);
    var pid = keys.pop();
    delete productIdQueue[pid];
    return pid;
  };

  var setProductToStatus = function (pid, status, callbacksCallback, callback) {

    var sql = 'UPDATE products SET ' +
      'currentStatus=' +
      '"' +
      status +
      '" ' +
      'WHERE ' +
      ' id='+ pid +
      ';';
    db.run(sql, function (err) {
        if (err) {
          log.warn('error updating product status ' + pid + ' to ' + status +': ' + err);
        }
        callback(callbacksCallback);
      }
    );
  };

  return {
    connect: connect,
    addProduct: addProduct,
    updateProductName: updateProductName,
    getProductName: getProductName,
    deleteProduct: deleteProduct,
    deleteJob: deleteJob,
    deleteRun: deleteRun,
    addRun: addRun,
    getJobRuns: getJobRuns,
    getProducts: getProducts,
    getAllJobs: getAllJobs,
    updateProductsStatus: updateProductsStatus,
    close: close,
    status: status,
    phase: phase
  }
});

module.exports = model;
