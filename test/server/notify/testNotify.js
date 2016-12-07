
var assert = require('assert');
var log4js = require('log4js');

var countOfAddRun = 0;
var countOfUpdateProductsStatus = 0;

var mockModel = (function () {
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

  var addRun = function (notification, callback) {
    countOfAddRun++; // increment as a method of determining the number of times notifications are submitted to model
    callback();
  };

  var updateProductsStatus = function (callback) {
    countOfUpdateProductsStatus++;
    callback();
  };

  return {
    status: status,
    phase: phase,
    addRun: addRun,
    updateProductsStatus: updateProductsStatus
  }

})();

describe('notify', function () {
  describe('#createNotification', function () {
    var notify = require('../../../server/notify/notify.js')(log4js, mockModel);
    it ('should create a notification with all parameters', function () {
      var name = 'testNote';
      var full_url = 'http://www.google.com';
      var number = 1;
      var phase = mockModel.phase.COMPLETED;
      var status = mockModel.status.SUCCESS;
      var valueUnit = 'MPH';
      var value = 85;
      var time = Date.now();

      var testNote = notify.createNotification(name, full_url, number, phase, status, valueUnit, value, time);

      assert.equal(name, testNote.name);
      assert.equal(full_url, testNote.build.full_url);
      assert.equal(number, testNote.build.number);
      assert.equal(phase, testNote.build.phase);
      assert.equal(status, testNote.build.status);
      assert.equal(valueUnit, testNote.valueUnit);
      assert.equal(value, testNote.build.value);
      assert.equal(time, testNote.build.time);

    });


    it ('should create a notification with no value or valueUnit', function () {
      var name = 'testNote';
      var full_url = 'http://www.google.com';
      var number = 1;
      var phase = mockModel.phase.COMPLETED;
      var status = mockModel.status.SUCCESS;
      var time = Date.now();

      var testNote = notify.createNotification(name, full_url, number, phase, status, undefined, undefined, time);

      assert.equal(name, testNote.name);
      assert.equal(full_url, testNote.build.full_url);
      assert.equal(number, testNote.build.number);
      assert.equal(phase, testNote.build.phase);
      assert.equal(status, testNote.build.status);
      assert.equal(time, testNote.build.time);

    });

    it ('should create a notification with no time', function () {
      var name = 'testNote';
      var full_url = 'http://www.google.com';
      var number = 1;
      var phase = mockModel.phase.COMPLETED;
      var status = mockModel.status.SUCCESS;
      var valueUnit = 'MPH';
      var value = 85;

      var testNote = notify.createNotification(name, full_url, number, phase, status, valueUnit, value);

      assert.equal(name, testNote.name);
      assert.equal(full_url, testNote.build.full_url);
      assert.equal(number, testNote.build.number);
      assert.equal(phase, testNote.build.phase);
      assert.equal(status, testNote.build.status);
      assert.equal(valueUnit, testNote.valueUnit);
      assert.equal(value, testNote.build.value);

    });


    it ('should create a notification with no optional parameters', function () {
      var name = 'testNote';
      var full_url = 'http://www.google.com';
      var number = 1;
      var phase = mockModel.phase.COMPLETED;
      var status = mockModel.status.SUCCESS;

      var testNote = notify.createNotification(name, full_url, number, phase, status);

      assert.equal(name, testNote.name);
      assert.equal(full_url, testNote.build.full_url);
      assert.equal(number, testNote.build.number);
      assert.equal(phase, testNote.build.phase);
      assert.equal(status, testNote.build.status);

    });
  });

  describe('#process', function () {
    var notify = require('../../../server/notify/notify.js')(log4js, mockModel);

    var processCallback = function (result) {

    };

    it('should fail to process with undefined data', function () {

      countOfAddRun = 0; //reset the addRun method count
      countOfUpdateProductsStatus = 0;

      notify.process(12, undefined, processCallback);

      assert.equal(countOfAddRun, 0);


    });

    it('should fail to process without name', function () {

      countOfAddRun = 0; //reset the addRun method count
      countOfUpdateProductsStatus = 0;
      var data = {
        build: {
          full_url: "http://something",
          number: 20,
          phase: "STARTED"
        }
      };

      notify.process(12, data, processCallback);

      assert.equal(countOfAddRun, 0);


    });
    it('should fail to process without build', function () {

      countOfAddRun = 0; //reset the addRun method count
      countOfUpdateProductsStatus = 0;
      var data = {
        name : "test1"
      };

      notify.process(12, data, processCallback);

      assert.equal(countOfAddRun, 0);

    });


    it('should fail to process without full_url', function () {

      countOfAddRun = 0; //reset the addRun method count
      countOfUpdateProductsStatus = 0;
      var data = {
        name : "test1",
        build: {
          number: 20,
          phase: "STARTED"
        }
      };

      notify.process(12, data, processCallback);

      assert.equal(countOfAddRun, 0);

    });

    it('should fail to process without number', function () {

      countOfAddRun = 0; //reset the addRun method count
      countOfUpdateProductsStatus = 0;
      var data = {
        name : "test1",
        build: {
          full_url: "http://something",
          phase: "STARTED"
        }
      };

      notify.process(12, data, processCallback);

      assert.equal(countOfAddRun, 0);

    });

    it('should successfully process with a positive number', function () {

      countOfAddRun = 0; //reset the addRun method count
      countOfUpdateProductsStatus = 0;
      var data = {
        name : "test1",
        build: {
          full_url: "http://something",
          phase: "STARTED",
          number: 1
        }
      };

      notify.process(12, data, processCallback);

      assert.equal(countOfAddRun, 1);

    });

    it('should successfully process with a negative number', function () {

      countOfAddRun = 0; //reset the addRun method count
      countOfUpdateProductsStatus = 0;
      var data = {
        name : "test1",
        build: {
          full_url: "http://something",
          phase: "STARTED",
          number: -1
        }
      };

      notify.process(12, data, processCallback);

      assert.equal(countOfAddRun, 1);

    });

    it('should successfully process with a zero number', function () {

      countOfAddRun = 0; //reset the addRun method count
      countOfUpdateProductsStatus = 0;
      var data = {
        name : "test1",
        build: {
          full_url: "http://something",
          phase: "STARTED",
          number: 0
        }
      };

      notify.process(12, data, processCallback);

      assert.equal(countOfAddRun, 1);

    });

    it('should fail to process without phase', function () {

      countOfAddRun = 0; //reset the addRun method count
      countOfUpdateProductsStatus = 0;
      var data = {
        name : "test1",
        build: {
          full_url: "http://something",
          number: 20,
          status: "FAILURE"
        }
      };

      notify.process(12, data, processCallback);

      assert.equal(countOfAddRun, 0);

    });

    it('should successfully process without status', function () {

      countOfAddRun = 0; //reset the addRun method count
      countOfUpdateProductsStatus = 0;
      var data = {
        name : "test1",
        build: {
          full_url: "http://something",
          number: 20,
          phase: "STARTED"
        }
      };

      notify.process(12, data, processCallback);

      assert.equal(countOfAddRun, 1);
      assert.equal(countOfUpdateProductsStatus, 1);

    });

    it('should successfully process with SUCCESS status', function () {

      countOfAddRun = 0; //reset the addRun method count
      countOfUpdateProductsStatus = 0;
      var data = {
        name : "test1",
        build: {
          full_url: "http://something",
          number: 20,
          phase: "STARTED",
          status: "SUCCESS"
        }
      };

      notify.process(12, data, processCallback);

      assert.equal(countOfAddRun, 1);
      assert.equal(countOfUpdateProductsStatus, 1);

    });


    it('should successfully process FAILURE status', function () {

      countOfAddRun = 0; //reset the addRun method count
      countOfUpdateProductsStatus = 0;
      var data = {
        name : "test1",
        build: {
          full_url: "http://something",
          number: 20,
          phase: "STARTED",
          status: "FAILURE"
        }
      };

      notify.process(12, data, processCallback);

      assert.equal(countOfAddRun, 1);
      assert.equal(countOfUpdateProductsStatus, 1);

    });

    it('should successfully process UNSTABLE status', function () {

      countOfAddRun = 0; //reset the addRun method count
      countOfUpdateProductsStatus = 0;
      var data = {
        name : "test1",
        build: {
          full_url: "http://something",
          number: 20,
          phase: "STARTED",
          status: "UNSTABLE"
        }
      };

      notify.process(12, data, processCallback);

      assert.equal(countOfAddRun, 1);
      assert.equal(countOfUpdateProductsStatus, 1);

    });

    it('should successfully process VARIABLE_CL status, with a value and valueUnit', function () {

      countOfAddRun = 0; //reset the addRun method count
      countOfUpdateProductsStatus = 0;
      var data = {
        name : "test1",
        valueUnit: "MPH",
        build: {
          full_url: "http://something",
          number: 20,
          phase: "STARTED",
          status: "VARIABLE_CL",
          value: 400
        }
      };

      notify.process(12, data, processCallback);

      assert.equal(countOfAddRun, 1);
      assert.equal(countOfUpdateProductsStatus, 1);

    });

    it('should not successfully process VARIABLE_CL status, and no value', function () {

      countOfAddRun = 0; //reset the addRun method count
      countOfUpdateProductsStatus = 0;
      var data = {
        name : "test1",
        build: {
          full_url: "http://something",
          number: 20,
          phase: "FINALIZED",
          status: "VARIABLE_CL"
        }
      };

      notify.process(12, data, processCallback);

      assert.equal(countOfAddRun, 0);
      assert.equal(countOfUpdateProductsStatus, 0);

    });

    it('should default status to success with unknown status and be successful (phase cannot be STARTED)', function () {

      countOfAddRun = 0; //reset the addRun method count
      countOfUpdateProductsStatus = 0;
      var data = {
        name : "test1",
        build: {
          full_url: "http://something",
          number: 20,
          phase: "FINALIZED",
          status: "unknown"
        }
      };

      /*
      I am hijacking the addRun method to test that the unknown status was actually changed to SUCCESS
       */
      var temp = mockModel.addRun;
      mockModel.addRun = function (notification, callback) {
        countOfAddRun++;
        assert.equal(notification.build.status, mockModel.status.SUCCESS);
        callback();
      };

      notify.process(12, data, processCallback);

      //Make sure to set the addRun method back.
      mockModel.addRun = temp;

      assert.equal(countOfAddRun, 1);
      assert.equal(countOfUpdateProductsStatus, 1);

    });

    it('should successfully process STARTED phase', function () {

      countOfAddRun = 0; //reset the addRun method count
      countOfUpdateProductsStatus = 0;
      var data = {
        name : "test1",
        build: {
          full_url: "http://something",
          number: 20,
          phase: "STARTED",
          status: "VARIABLE_CL"
        }
      };

      notify.process(12, data, processCallback);

      assert.equal(countOfAddRun, 1);
      assert.equal(countOfUpdateProductsStatus, 1);

    });

    it('should successfully process FINISHED phase', function () {

      countOfAddRun = 0; //reset the addRun method count
      countOfUpdateProductsStatus = 0;
      var data = {
        name : "test1",
        build: {
          full_url: "http://something",
          number: 20,
          phase: "FINISHED",
          status: "UNSTABLE"
        }
      };

      notify.process(12, data, processCallback);

      assert.equal(countOfAddRun, 1);
      assert.equal(countOfUpdateProductsStatus, 1);

    });

    it('should successfully process COMPLETED phase', function () {

      countOfAddRun = 0; //reset the addRun method count
      countOfUpdateProductsStatus = 0;
      var data = {
        name : "test1",
        build: {
          full_url: "http://something",
          number: 20,
          phase: "COMPLETED",
          status: "UNSTABLE"
        }
      };

      notify.process(12, data, processCallback);

      assert.equal(countOfAddRun, 1);
      assert.equal(countOfUpdateProductsStatus, 1);

    });

    it('should successfully process FINALIZED phase', function () {

      countOfAddRun = 0; //reset the addRun method count
      countOfUpdateProductsStatus = 0;
      var data = {
        name : "test1",
        build: {
          full_url: "http://something",
          number: 20,
          phase: "FINALIZED",
          status: "UNSTABLE"
        }
      };

      notify.process(12, data, processCallback);

      assert.equal(countOfAddRun, 1);
      assert.equal(countOfUpdateProductsStatus, 1);

    });

    it('should successfully process FINALIZED phase', function () {

      countOfAddRun = 0; //reset the addRun method count
      countOfUpdateProductsStatus = 0;
      var data = {
        name : "test1",
        build: {
          full_url: "http://something",
          number: 20,
          phase: "FINALIZED",
          status: "UNSTABLE"
        }
      };

      notify.process(12, data, processCallback);

      //process will call each of these once given its input
      assert.equal(countOfAddRun, 1);
      assert.equal(countOfUpdateProductsStatus, 1);

    });

    it('should successfully process with time parameter', function () {

      countOfAddRun = 0; //reset the addRun method count
      countOfUpdateProductsStatus = 0;
      var data = {
        name : "test1",
        build: {
          full_url: "http://something",
          number: 20,
          phase: "FINALIZED",
          status: "UNSTABLE",
          time: 132165468
        }
      };

      notify.process(12, data, processCallback);

      //process will call each of these once given its input
      assert.equal(countOfAddRun, 1);
      assert.equal(countOfUpdateProductsStatus, 1);

    });


    it('should successfully process two notifications in a row', function () {


      countOfAddRun = 0; //reset the addRun method count
      countOfUpdateProductsStatus = 0;
      var data = {
        name : "test1",
        build: {
          full_url: "http://something",
          number: 20,
          phase: "STARTED"
        }
      };


      /*
        I am nastily hijacking the addRun method, to submit another notification
        while the first is still processing. This is a "clever" bit of whitebox testing,
        to insure that the notification queueing system is working correctly.

        As such, the way that this addRun is written is to closely mimic the way that notify handles its
        internal queueing. The result of this is that it calls addRun as many times as inside this function,
        and only updates the productsStatus once, after all of the notifications in the queue get added.
       */
      var tempFunction = mockModel.addRun;
      mockModel.addRun = function(notification, callback) {
        countOfAddRun++;
        //must reset the function to prevent infinite recursion
        mockModel.addRun = tempFunction;
        notify.process(12, data, processCallback);
        notify.process(12, data, processCallback);
        notify.process(12, data, processCallback);
        notify.process(12, data, processCallback);
        callback();
      };

      notify.process(12, data, processCallback);

      //process will call each of these once given its input
      assert.equal(countOfAddRun, 5); //must call add run twice, one for each notification
      assert.equal(countOfUpdateProductsStatus, 1); // and update status only once, after all notifications have been emptied from notifies internal queue

    });


  })
});