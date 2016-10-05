var model = (function (log4js, dbFile) {
  var log = log4js.getLogger('model');
  log.setLevel('WARN');

  var DbClient = require('sqlite3').verbose(),
    assert = require('assert');

  var action = null; //this is used to trigger actions based on Database operations
  // it must be set later because of dependencies.

  var db = null;

  var status = {
    SUCCESS: "SUCCESS",
    FAILURE: "FAILURE",
    UNSTABLE: "UNSTABLE",
    VARIABLE_CL: "VARIABLE_CL"
  };
  var phase = {
    STARTED: "STARTED",
    FINISHED: "FINISHED",
    COMPLETED: "COMPLETED",
    FINALIZED: "FINALIZED"
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
      'forwardUrl TEXT DEFAULT NULL, ' +
      'relayMapping TEXT DEFAULT NULL, ' +
      'lastSuccess INTEGER NOT NULL DEFAULT ' + Date.now() + ', ' +
      'forwardCount INTEGER NOT NULL DEFAULT ' + 0 + ', ' +
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
      'upperControlLimit Integer NOT NULL DEFAULT 0, ' +
      'lowerControlLimit INTEGER NOT NULL DEFAULT 0, ' +
      'FOREIGN KEY(productId) REFERENCES products(id)' +
      ');';
    var createRunTable = 'CREATE TABLE IF NOT EXISTS runs ' +
      '(' +
      'id INTEGER PRIMARY KEY AUTOINCREMENT, ' +
      'productId INTEGER NOT NULL, ' +
      'jobId INTEGER NOT NULL, ' +
      'time INTEGER NOT NULL UNIQUE, ' +
      'full_url TEXT NOT NULL, ' +
      'number INTEGER NOT NULL, ' +
      'status TEXT NOT NULL, ' +
      'value INTEGER, ' +
      'CONSTRAINT unq UNIQUE (jobId, number), ' +
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

  var updateForwardUrl = function (id, url, callback) {

    var sql = 'UPDATE products SET ' +
      'forwardUrl=' +
      '"' +
      url +
      '" ' +
      'WHERE ' +
      ' id='+ id +
      ';';
    db.run(sql, function (err) {
        if (err) {
          log.warn('error updating product ' + id + ': ' + err);
        }
        callback(err);
      }
    );
  };

  var updateRelayMapping = function (id, relayMapping, callback) {

    var sql = 'UPDATE products SET ' +
      'relayMapping=' +
      '"' +
      relayMapping +
      '" ' +
      'WHERE ' +
      ' id='+ id +
      ';';
    db.run(sql, function (err) {
        if (err) {
          log.warn('error updating product ' + id + ': ' + err);
        }
        callback(err);
      }
    );
  };

  var deleteProduct = function (id, callback) {

    var sql = 'DELETE FROM products ' +
      'WHERE ' +
      ' products.id='+ id +
      ';';
    db.run(sql, function (err) {
        if (err) {
          log.warn('error deleting product ' + id + ': ' + err);
          callback(err);
        } else {

          var sql = 'DELETE FROM jobs ' +
            'WHERE ' +
            ' jobs.productId=' + id +
            ';';
          db.run(sql, function (err) {
              if (err) {
                log.warn('error deleting jobs for pid ' + id + ': ' + err);
                callback(err);
              } else {
                var sql = 'DELETE FROM runs ' +
                  'WHERE ' +
                  ' runs.productId=' + id +
                  ';';
                db.run(sql, function (err) {
                    if (err) {
                      log.warn('error deleting runs for pid ' + id + ': ' + err);
                      callback(err);
                    } else {
                      callback();
                    }
                  }
                );
              }
            }
          );
        }
      }
    );
  };

  var deleteJob = function (pid, jid, callback) {

    var sql = 'DELETE FROM jobs ' +
      'WHERE ' +
      ' jobs.id='+ jid +
      ';';
    db.run(sql, function (err) {
        if (err) {
          log.warn('error deleting job ' + jid + ': ' + err);
        } else {
          var sql = 'DELETE FROM runs ' +
            'WHERE ' +
            ' runs.jobId='+ jid +
            ';';
          db.run(sql, function (err) {
              if (err) {
                log.warn('error deleting runs for jid ' + jid + ': ' + err);
              }
              pushProductId(pid);
              pollProductUpdateQueue(callback);
            }
          );
        }
      }
    );
  };


  var deleteRun = function (pid, jid, rid, callback) {

    var sql = 'DELETE FROM runs ' +
      'WHERE ' +
      ' id='+ rid +
      ';';
    db.run(sql, function (err) {
        if (err) {
          log.warn('error deleting run ' + name + ': ' + err);
        }
        getRunsStatus(jid, function (status) {
          setJobToStatus(jid, status, function () {
            pushProductId(pid);
            pollProductUpdateQueue(callback);
          });
        });
      }
    );
  };

  var getProductSummary = function (id, callback) {
    var selectName = 'SELECT ' +
      'name, ' +
      '(SELECT SUM(CASE WHEN currentStatus="'+status.SUCCESS+'" THEN 1 ELSE 0 END) FROM jobs WHERE productId='+id+') numSuccess, ' +
      '(SELECT SUM(CASE WHEN currentStatus="'+status.UNSTABLE+'" THEN 1 ELSE 0 END) FROM jobs WHERE productId='+id+') numUnstable, ' +
      '(SELECT SUM(CASE WHEN currentStatus="'+status.FAILURE+'" THEN 1 ELSE 0 END) FROM jobs WHERE productId='+id+') numFailed ' +
      'FROM ' +
      'products ' +
      'WHERE ' +
      'id="' + id + '" ' +
      ';';
    db.all(selectName, function (err, result) {
      if (err) {
        log.warn('error getting product summary for id ' + id);
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

  /**
   * This method is in charge of adding run notifications, and as such,
   * it must do several things in a string of callbacks.
   * 1st, there are two possibilities for the notification:
   *  1. a job exists
   *  2. a job does not exist
   * This is checked with a query called checkQuery.
   * if checkQuery has a result (result.length !== 0) then 1 is true, and we can get the jobId for it.
   * if checkQuery does not, then we must insert a new job, using addJobEntry, and then insert the notification in the
   * run table. This is why addJobEntry must return the jid.
   *
   * In addition, this method must update the lists that keep track of what products should be checked at the end
   * of a notification cascade. AND it must tell the server to update the current status of the job
   * that the run belongs to. It is only after this job is updated that the original callback is called.
   *
   * @param notification - the notification from notify.js that is to be added as a run
   * @param callback - where to return to.
   */
  var addRun = function (notification, callback) {

    var checkQuery = 'SELECT * FROM ' +
      'jobs ' +
      'WHERE ' +
      'productId=' + notification.productId + ' AND ' +
      'name="' + notification.name + '"' +
      ';';

    var runEntryBeforeJid = 'INSERT OR REPLACE INTO runs ' +
      '(' +
      'productId, ' +
      'jobId, ' +
      'time, ' +
      'full_url, ' +
      'number, ' +
      'status ' +
      ((notification.build.value !== null) ? ', value ':'') +
      ') VALUES (' +
      '"' + notification.productId + '", ';

    //If user passes -1 to number, it is auto-filled with a run number starting from 0.
    var number = notification.build.number;
    if (notification.build.number === -1) {
      number = '(SELECT COUNT(*) FROM runs WHERE jobId=(SELECT jobs.id FROM jobs WHERE name="'+ notification.name + '"))';
    }
    var statusStringSQL;
    if (notification.build.status === status.VARIABLE_CL){
      /*
        If a VARIABLE_CL status is provided, create a subquery to check the run against
        Control Limits defined in the job, autofilling the success with a CASE statement
       */
      statusStringSQL = '(SELECT CASE WHEN ('+notification.build.value+'  <= ucl AND '+notification.build.value+' >= lcl) ' +
        'THEN "'+status.SUCCESS+'" ELSE "'+status.FAILURE+'" END FROM ' +
        '(SELECT ' +
        'jobs.upperControlLimit AS ucl, ' +
        'jobs.lowerControlLimit AS lcl ' +
        'FROM jobs WHERE jobs.name="'+notification.name+'" ))';
    } else {
      statusStringSQL = '"' + notification.build.status + '" ';
    }

    var runEntryAfterJid = ', ' +
      notification.build.time + ', ' +
      '"' + notification.build.full_url + '", ' +
      number + ', ' + //will cause an issue if number is undefined.
      statusStringSQL +
      ((notification.build.value !== null) ? ', ' + notification.build.value + ' ':'') +
      ');';

    db.all(checkQuery, function (err, result) {
      if (!err) {
        if (result.length !== 0) {
          //there is already a job entry, so add a run
          var runEntry = runEntryBeforeJid + result[0].id + runEntryAfterJid;
          //log.info(runEntry);
          db.run(runEntry, function (err) {
            if (err) {
              log.warn('could not add run [1]: ' + err);
              callback(err);
            } else if (notification.build.status !== phase.STARTED) {
              pushProductId(notification.productId);
              var rid = this.lastID;// this is only to pass the rid on to the next function. Builtin from sqlite3
              updateJobFromRun(result[0].id, rid, notification.build.time, notification.build.full_url, notification.build.status, callback);
            } else {
              //don't add started changes
              callback();
            }
          });
        } else {
          //add a job entry, then add a run
          addJobEntry(notification, function (jobId) {
            var runEntry = runEntryBeforeJid + jobId + runEntryAfterJid;
            //log.info(runEntry);
            db.run(runEntry, function (err) {
              if (err) {
                log.warn('could not add run [2]: ' + err);
                callback(err);
              } else if (notification.build.status !== phase.STARTED) {
                pushProductId(notification.productId);
                var rid = this.lastID; // this is only to pass the rid on to the next function. Builtin from sqlite3
                updateJobFromRun(jobId, rid, notification.build.time, notification.build.full_url, notification.build.status, callback);
              } else {
                //don't add started changes
                callback();
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

  var updateJobFromRun = function (jid, rid, time, url, rstatus, callback) {

    var statusString;
    if (rstatus == status.VARIABLE_CL) {
      statusString = '(SELECT runs.status FROM runs WHERE id='+rid+') ';
    } else {
      statusString = '"' + rstatus + '" ';
    }

    var sql = 'UPDATE jobs SET ' +
      'latestTime=' +
      '' +
      time +
      ', ' +
      'full_url=' +
      '"' +
      url +
      '",' +
      'currentStatus=' + statusString +
      'WHERE ' +
      ' id=' + jid +
      ';';
    db.run(sql, function (err) {
      if (err) {
        log.warn('error updating job ' + jid + ' to run ' + time + ', ' + url + ', ' + rstatus + ': ' + err);
        callback(err);
      } else {
        callback();
      }
    });
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
          log.warn('added job entry, but could not identify ID');
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

  var getJobRunsLimited = function (jobId, limit, callback) {
    var runQuery = 'SELECT * FROM runs ' +
      'WHERE ' +
      'jobId=' + jobId + ' ' +
      'ORDER BY id DESC ' +
      'LIMIT ' + limit + '' +
      ';';

    db.all(runQuery, function (err, result) {
      if (!err) {
        callback(result);
      } else {
        log.warn('could not getJobRunsLimited for jobId ' + jobId + ' and limit ' + limit);
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
        if (result[0] === undefined) {
          callback(status.SUCCESS);
        } else {
          callback(result[0].status);
        }
      } else {
        log.warn('could not getRunsStatus: ' + err);
        //callback([]);
        callback(status.SUCCESS);
      }
    });

  };

  var setJobToStatus = function (jid, setStatus, callback) {

    var sql = 'UPDATE jobs SET ' +
      'currentStatus=' +
      '"' +
      setStatus +
      '" ' +
      'WHERE ' +
      ' id='+ jid +
      ';';
    db.run(sql, function (err) {
        if (err) {
          log.warn('error updating job status ' + jid + ' to ' + setStatus +': ' + err);
        }
        callback(err);
      }
    );
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
        setProductToStatus(pid, statusToSet, function () {
          /*

          This is exactly where to hook up code that detects when a products status has changed
          So far, these actions are:
            Forwarding to another server
            Triggering changing EFD lights

          I am fairly confident right now that these can be called asynchronously to the main polling loop
          shouldn't rely on callbacks within the loop.

          */
          performStatusChangeActions(pid);
          pollProductUpdateQueue(callback);
        });
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

  var setProductToStatus = function (pid, setStatus, callback) {

    var sql = 'UPDATE products SET ' +
      'currentStatus=' +
      '"' +
      setStatus +
      '" ' +
      ((setStatus === status.SUCCESS) ? ', lastSuccess='+Date.now()+' ':'') +
      'WHERE ' +
      ' id='+ pid +
      ';';
    db.run(sql, function (err) {
        if (err) {
          log.warn('error updating product status ' + pid + ' to ' + setStatus +': ' + err);
        }
        callback();
      }
    );
  };

  var performStatusChangeActions = function (pid) {
    //TODO update EFD light configuration if this is a raspi
    var sql = 'SELECT ' +
      '* ' +
      'FROM products ' +
      'WHERE ' +
      'id=' + pid +
      ';';

    db.all(sql, function (err, result) {
      if (!err) {
        //log.fatal('result = ' +JSON.stringify(result));
        if (result[0] === undefined) {
          log.warn('getting product info from pid ' + pid + ' returned undefined');
        } else {
          var forwardUrl = result[0].forwardUrl;
          var relayMapping = result[0].relayMapping;

          if (forwardUrl !== null && forwardUrl !== '' && forwardUrl !== undefined) {
            action.sendProductStatusNotification(result[0]);
          }

          if (relayMapping !== null && relayMapping !== '' && relayMapping !== undefined) {
            action.updateRaspiLights(result[0]);
          }

        }
      } else {
        log.warn('could not get product Information for id: ' + pid);
      }
    });
  };

  var updateForwardCount = function (pid, count) {

    var sql = 'UPDATE products SET ' +
      'forwardCount=' +
      '' +
      count +
      ' ' +
      'WHERE ' +
      ' id='+ pid +
      ';';
    db.run(sql, function (err) {
        if (err) {
          log.warn('error updating product forwardCount ' + pid + ' to ' + count +': ' + err);
        }
      }
    );
  };

  var updateControlLimits = function (pid, jid, upperControlLimit, lowerControlLimit, callback) {

    var sql = 'UPDATE jobs SET ' +
      'upperControlLimit=' +
      '' +
      upperControlLimit +
      ', ' +
      'lowerControlLimit=' +
      '' +
      lowerControlLimit +
      ' ' +
      'WHERE ' +
      ' id='+ jid +
      ';';

    db.run(sql, function (err) {
        if (err) {
          log.warn('error updating job ' + jid + ' to LCL ' + lowerControlLimit +' and UCL '+ upperControlLimit +': ' + err);
        }
        callback(err);
      }
    );
  };

  var setAction = function (a) {
    action = a;
  };

  return {
    connect: connect,
    setAction: setAction,
    addProduct: addProduct,
    updateProductName: updateProductName,
    getProductSummary: getProductSummary,
    deleteProduct: deleteProduct,
    deleteJob: deleteJob,
    deleteRun: deleteRun,
    addRun: addRun,
    getJobRuns: getJobRuns,
    getJobRunsLimited: getJobRunsLimited,
    getProducts: getProducts,
    getAllJobs: getAllJobs,
    updateProductsStatus: updateProductsStatus,
    updateRelayMapping: updateRelayMapping,
    updateForwardUrl: updateForwardUrl,
    updateForwardCount: updateForwardCount,
    updateControlLimits: updateControlLimits,
    close: close,
    status: status,
    phase: phase
  }
});

module.exports = model;
