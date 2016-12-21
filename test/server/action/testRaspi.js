
var assert = require('assert');
var log4js = require('log4js');

var openCount;
var closeCount;
var writeCount;


var mockGpio = function  () {

  var open = function (pinNum, forWhat, callback) {
    openCount++;

    callback();

  };

  var close = function (pinNum, callback) {
    closeCount++;

    callback();

  };

  var write = function (pin, state, callback) {
    writeCount++;

    callback();

  };

  return {
    open: open,
    close: close,
    write: write
  };
}();

var mockIsRaspi = true;

describe('action', function () {
  var raspi = require('../../../server/action/raspi.js')(log4js, mockGpio, mockIsRaspi);

  //Pins are internal to the class for now, so I am just testing whether they all
  //successfully get opened and without side effect;
  describe('#openPins', function () {

    it('should not open anything if isRaspi is false', function () {
      var tempRaspi = require('../../../server/action/raspi.js')(log4js, mockGpio, false);
      openCount = 0;
      closeCount = 0;
      writeCount = 0;

      tempRaspi.openPins();

      assert.equal(openCount, 0);
      assert.equal(closeCount, 0);
      assert.equal(writeCount, 0);
    });

    it('should not open anything if isRaspi is not boolean', function () {
      var tempRaspi = require('../../../server/action/raspi.js')(log4js, mockGpio, 'true');
      openCount = 0;
      closeCount = 0;
      writeCount = 0;

      tempRaspi.openPins();

      assert.equal(openCount, 0);
      assert.equal(closeCount, 0);
      assert.equal(writeCount, 0);
    });

    it('should not open anything if gpio is null', function () {
      var tempRaspi = require('../../../server/action/raspi.js')(log4js, null, mockIsRaspi);
      openCount = 0;
      closeCount = 0;
      writeCount = 0;

      tempRaspi.openPins();

      assert.equal(openCount, 0);
      assert.equal(closeCount, 0);
      assert.equal(writeCount, 0);
    });

    it('should not open anything if gpio is undefined', function () {
      var tempRaspi = require('../../../server/action/raspi.js')(log4js, undefined, mockIsRaspi);
      openCount = 0;
      closeCount = 0;
      writeCount = 0;

      tempRaspi.openPins();

      assert.equal(openCount, 0);
      assert.equal(closeCount, 0);
      assert.equal(writeCount, 0);
    });


    it('should not open pins if isRaspi is true and gpio is defined but does not have open function', function () {
      var temp = mockGpio.open;
      mockGpio.open = undefined;

      var tempRaspi = require('../../../server/action/raspi.js')(log4js, mockGpio, mockIsRaspi);
      openCount = 0;
      closeCount = 0;
      writeCount = 0;

      tempRaspi.openPins();

      assert.equal(openCount, 0);
      assert.equal(closeCount, 0);
      assert.equal(writeCount, 0);

      mockGpio.open = temp;
    });


    it('should open pins if isRaspi is true and gpio is defined and has open function', function () {
      openCount = 0;
      closeCount = 0;
      writeCount = 0;

      raspi.openPins();

      assert.equal(openCount, 8);
      assert.equal(closeCount, 0);
      assert.equal(writeCount, 0);
    });


    it('should handle if opening a pin caused an error', function () {
      var temp = mockGpio.open;
      mockGpio.open = function (pinNum, forWhat, callback) {
        openCount++;

        var err = "there was an error";
        callback(err);

      };

      var tempRaspi = require('../../../server/action/raspi.js')(log4js, mockGpio, mockIsRaspi);
      openCount = 0;
      closeCount = 0;
      writeCount = 0;

      tempRaspi.openPins();

      assert.equal(openCount, 8);
      assert.equal(closeCount, 0);
      assert.equal(writeCount, 0);

      mockGpio.open = temp;
    });
  });

  describe('#closePins', function () {

    var closePinsCallback = function () {

    };

    it('should not close anything if isRaspi is false', function () {
      var tempRaspi = require('../../../server/action/raspi.js')(log4js, mockGpio, false);
      openCount = 0;
      closeCount = 0;
      writeCount = 0;

      tempRaspi.closePins(closePinsCallback);

      assert.equal(openCount, 0);
      assert.equal(closeCount, 0);
      assert.equal(writeCount, 0);
    });

    it('should not close anything if isRaspi is not boolean', function () {
      var tempRaspi = require('../../../server/action/raspi.js')(log4js, mockGpio, 'true');
      openCount = 0;
      closeCount = 0;
      writeCount = 0;

      tempRaspi.closePins(closePinsCallback);

      assert.equal(openCount, 0);
      assert.equal(closeCount, 0);
      assert.equal(writeCount, 0);
    });

    it('should not close anything if gpio is null', function () {
      var tempRaspi = require('../../../server/action/raspi.js')(log4js, null, mockIsRaspi);
      openCount = 0;
      closeCount = 0;
      writeCount = 0;

      tempRaspi.closePins(closePinsCallback);

      assert.equal(openCount, 0);
      assert.equal(closeCount, 0);
      assert.equal(writeCount, 0);
    });

    it('should not close anything if gpio is undefined', function () {
      var tempRaspi = require('../../../server/action/raspi.js')(log4js, undefined, mockIsRaspi);
      openCount = 0;
      closeCount = 0;
      writeCount = 0;

      tempRaspi.closePins(closePinsCallback);

      assert.equal(openCount, 0);
      assert.equal(closeCount, 0);
      assert.equal(writeCount, 0);
    });


    it('should not close pins if isRaspi is true and gpio is defined but does not have close function', function () {
      var temp = mockGpio.close;
      mockGpio.close = undefined;

      var tempRaspi = require('../../../server/action/raspi.js')(log4js, mockGpio, mockIsRaspi);
      openCount = 0;
      closeCount = 0;
      writeCount = 0;

      tempRaspi.closePins(closePinsCallback);

      assert.equal(openCount, 0);
      assert.equal(closeCount, 0);
      assert.equal(writeCount, 0);

      mockGpio.close = temp;
    });


    it('should close pins if isRaspi is true and gpio is defined and has close function', function () {
      openCount = 0;
      closeCount = 0;
      writeCount = 0;

      raspi.closePins(closePinsCallback);

      assert.equal(openCount, 0);
      assert.equal(closeCount, 8);
      assert.equal(writeCount, 0);
    });


    it('should handle if closing a pin caused an error', function () {
      var temp = mockGpio.close;
      mockGpio.close = function (pinNum, callback) {
        closeCount++;

        var err = "there was an error";
        callback(err);

      };

      var tempRaspi = require('../../../server/action/raspi.js')(log4js, mockGpio, mockIsRaspi);
      openCount = 0;
      closeCount = 0;
      writeCount = 0;

      tempRaspi.closePins();

      assert.equal(openCount, 0);
      assert.equal(closeCount, 8);
      assert.equal(writeCount, 0);

      mockGpio.close = temp;
    });
  });

  describe('#setStates', function () {

    it('should not set states if modelStatusCodes is undefined', function () {

      raspi.setStates(undefined);

    });

    it('should not set states if modelStatusCodes is null', function () {

      raspi.setStates(null);

    });

    it('should not set states if modelStatusCodes does not have SUCCESS state', function () {

      var statusCodes = {
        UNSTABLE: "UNSTABLE",
        FAILURE: "FAILURE"
      };

      raspi.setStates(statusCodes);

    });

    it('should not set states if modelStatusCodes does not have UNSTABLE state', function () {

      var statusCodes = {
        SUCCESS: "SUCCESS",
        FAILURE: "FAILURE"
      };

      raspi.setStates(statusCodes);

    });

    it('should not set states if modelStatusCodes does not have FAILURE state', function () {

      var statusCodes = {
        SUCCESS: "SUCCESS",
        UNSTABLE: "UNSTABLE"
      };

      raspi.setStates(statusCodes);

    });



    it('should set states if modelStatusCodes has SUCCESS, UNSTABLE, and FAILURE states', function () {

      var statusCodes = {
        SUCCESS: "SUCCESS",
        UNSTABLE: "UNSTABLE",
        FAILURE: "FAILURE"
      };

      assert.doesNotThrow(
        function ()  { raspi.setStates(statusCodes);}
      );
    });
  });

  describe('#setRelaysToState', function () {
    //should use relays numbers 1 - 8
    //it should call gpio.write for every pair of correct pins entered.

    it ('should not set change relay states if isRaspi is false', function () {
      var tempRaspi = require('../../../server/action/raspi.js')(log4js, mockGpio, false);
      openCount = 0;
      closeCount = 0;
      writeCount = 0;

      var relay1 = 1;
      var relay2 = 2;
      var status = "SUCCESS";

      var statusCodes = {
        SUCCESS: "SUCCESS",
        UNSTABLE: "UNSTABLE",
        FAILURE: "FAILURE"
      };

      tempRaspi.setStates (statusCodes);

      tempRaspi.setRelaysToStatus(relay1, relay2, status);

      assert.equal(openCount, 0);
      assert.equal(closeCount, 0);
      assert.equal(writeCount, 0);
    });

    it ('should not set change relay states if isRaspi is not boolean', function () {
      var tempRaspi = require('../../../server/action/raspi.js')(log4js, mockGpio, 'true');
      openCount = 0;
      closeCount = 0;
      writeCount = 0;

      var relay1 = 1;
      var relay2 = 2;
      var status = "SUCCESS";

      var statusCodes = {
        SUCCESS: "SUCCESS",
        UNSTABLE: "UNSTABLE",
        FAILURE: "FAILURE"
      };

      tempRaspi.setStates (statusCodes);

      tempRaspi.setRelaysToStatus(relay1, relay2, status);

      assert.equal(openCount, 0);
      assert.equal(closeCount, 0);
      assert.equal(writeCount, 0);
    });

    it ('should not set change relay states if gpio is undefined', function () {
      var tempRaspi = require('../../../server/action/raspi.js')(log4js, undefined, true);
      openCount = 0;
      closeCount = 0;
      writeCount = 0;

      var relay1 = 1;
      var relay2 = 2;
      var status = "SUCCESS";

      var statusCodes = {
        SUCCESS: "SUCCESS",
        UNSTABLE: "UNSTABLE",
        FAILURE: "FAILURE"
      };

      tempRaspi.setStates (statusCodes);

      tempRaspi.setRelaysToStatus(relay1, relay2, status);

      assert.equal(openCount, 0);
      assert.equal(closeCount, 0);
      assert.equal(writeCount, 0);
    });

    it ('should not set change relay states if gpio is null', function () {
      var tempRaspi = require('../../../server/action/raspi.js')(log4js, null, true);
      openCount = 0;
      closeCount = 0;
      writeCount = 0;

      var relay1 = 1;
      var relay2 = 2;
      var status = "SUCCESS";

      var statusCodes = {
        SUCCESS: "SUCCESS",
        UNSTABLE: "UNSTABLE",
        FAILURE: "FAILURE"
      };

      tempRaspi.setStates (statusCodes);

      tempRaspi.setRelaysToStatus(relay1, relay2, status);

      assert.equal(openCount, 0);
      assert.equal(closeCount, 0);
      assert.equal(writeCount, 0);
    });

    it ('should not set change relay states if gpio does not have a write function', function () {
      var temp = mockGpio.write;
      mockGpio.write = undefined;
      var tempRaspi = require('../../../server/action/raspi.js')(log4js, mockGpio, true);
      openCount = 0;
      closeCount = 0;
      writeCount = 0;

      var relay1 = 1;
      var relay2 = 2;
      var status = "SUCCESS";

      var statusCodes = {
        SUCCESS: "SUCCESS",
        UNSTABLE: "UNSTABLE",
        FAILURE: "FAILURE"
      };

      tempRaspi.setStates (statusCodes);

      tempRaspi.setRelaysToStatus(relay1, relay2, status);

      assert.equal(openCount, 0);
      assert.equal(closeCount, 0);
      assert.equal(writeCount, 0);

      mockGpio.write = temp;
    });

    it ('should not set change relay states if relay 1 is less than 1', function () {
      var tempRaspi = require('../../../server/action/raspi.js')(log4js, mockGpio, true);
      openCount = 0;
      closeCount = 0;
      writeCount = 0;

      var relay1 = 0;
      var relay2 = 2;
      var status = "SUCCESS";

      var statusCodes = {
        SUCCESS: "SUCCESS",
        UNSTABLE: "UNSTABLE",
        FAILURE: "FAILURE"
      };

      tempRaspi.setStates (statusCodes);

      tempRaspi.setRelaysToStatus(relay1, relay2, status);

      assert.equal(openCount, 0);
      assert.equal(closeCount, 0);
      assert.equal(writeCount, 0);
    });

    it ('should not set change relay states if relay 2 is less than 1', function () {
      var tempRaspi = require('../../../server/action/raspi.js')(log4js, mockGpio, true);
      openCount = 0;
      closeCount = 0;
      writeCount = 0;

      var relay1 = 1;
      var relay2 = 0;
      var status = "SUCCESS";

      var statusCodes = {
        SUCCESS: "SUCCESS",
        UNSTABLE: "UNSTABLE",
        FAILURE: "FAILURE"
      };

      tempRaspi.setStates (statusCodes);

      tempRaspi.setRelaysToStatus(relay1, relay2, status);

      assert.equal(openCount, 0);
      assert.equal(closeCount, 0);
      assert.equal(writeCount, 0);
    });

    it ('should not set change relay states if relay 1 equal to relay 2', function () {
      var tempRaspi = require('../../../server/action/raspi.js')(log4js, mockGpio, true);
      openCount = 0;
      closeCount = 0;
      writeCount = 0;

      var relay1 = 2;
      var relay2 = 2;
      var status = "SUCCESS";

      var statusCodes = {
        SUCCESS: "SUCCESS",
        UNSTABLE: "UNSTABLE",
        FAILURE: "FAILURE"
      };

      tempRaspi.setStates (statusCodes);

      tempRaspi.setRelaysToStatus(relay1, relay2, status);

      assert.equal(openCount, 0);
      assert.equal(closeCount, 0);
      assert.equal(writeCount, 0);
    });

    it ('should not set change relay states if relay 1 is greater than 8', function () {
      var tempRaspi = require('../../../server/action/raspi.js')(log4js, mockGpio, true);
      openCount = 0;
      closeCount = 0;
      writeCount = 0;

      var relay1 = 9;
      var relay2 = 1;
      var status = "SUCCESS";

      var statusCodes = {
        SUCCESS: "SUCCESS",
        UNSTABLE: "UNSTABLE",
        FAILURE: "FAILURE"
      };

      tempRaspi.setStates (statusCodes);

      tempRaspi.setRelaysToStatus(relay1, relay2, status);

      assert.equal(openCount, 0);
      assert.equal(closeCount, 0);
      assert.equal(writeCount, 0);
    });

    it ('should not set change relay states if relay 2 is greater than 8', function () {
      var tempRaspi = require('../../../server/action/raspi.js')(log4js, mockGpio, true);
      openCount = 0;
      closeCount = 0;
      writeCount = 0;

      var relay1 = 1;
      var relay2 = 9;
      var status = "SUCCESS";

      var statusCodes = {
        SUCCESS: "SUCCESS",
        UNSTABLE: "UNSTABLE",
        FAILURE: "FAILURE"
      };

      tempRaspi.setStates (statusCodes);

      tempRaspi.setRelaysToStatus(relay1, relay2, status);

      assert.equal(openCount, 0);
      assert.equal(closeCount, 0);
      assert.equal(writeCount, 0);
    });


    it ('should not set change relay states if status is not in statusCodes', function () {
      var tempRaspi = require('../../../server/action/raspi.js')(log4js, mockGpio, true);
      openCount = 0;
      closeCount = 0;
      writeCount = 0;

      var relay1 = 1;
      var relay2 = 7;
      var status = "TEST";

      var statusCodes = {
        SUCCESS: "SUCCESS",
        UNSTABLE: "UNSTABLE",
        FAILURE: "FAILURE"
      };

      tempRaspi.setStates (statusCodes);

      tempRaspi.setRelaysToStatus(relay1, relay2, status);

      assert.equal(openCount, 0);
      assert.equal(closeCount, 0);
      assert.equal(writeCount, 0);
    });

    it ('should change relay states if status is SUCCESS', function () {
      var tempRaspi = require('../../../server/action/raspi.js')(log4js, mockGpio, true);
      openCount = 0;
      closeCount = 0;
      writeCount = 0;

      var relay1 = 1;
      var relay2 = 8;
      var status = "SUCCESS";

      var statusCodes = {
        SUCCESS: "SUCCESS",
        UNSTABLE: "UNSTABLE",
        FAILURE: "FAILURE"
      };

      tempRaspi.setStates (statusCodes);

      tempRaspi.setRelaysToStatus(relay1, relay2, status);

      assert.equal(openCount, 0);
      assert.equal(closeCount, 0);
      assert.equal(writeCount, 2);
    });

    it ('should change relay states if status is UNSTABLE', function () {
      var tempRaspi = require('../../../server/action/raspi.js')(log4js, mockGpio, true);
      openCount = 0;
      closeCount = 0;
      writeCount = 0;

      var relay1 = 1;
      var relay2 = 8;
      var status = "UNSTABLE";

      var statusCodes = {
        SUCCESS: "SUCCESS",
        UNSTABLE: "UNSTABLE",
        FAILURE: "FAILURE"
      };

      tempRaspi.setStates (statusCodes);

      tempRaspi.setRelaysToStatus(relay1, relay2, status);

      assert.equal(openCount, 0);
      assert.equal(closeCount, 0);
      assert.equal(writeCount, 2);
    });

    it ('should change relay states if status is FAILURE', function () {
      var tempRaspi = require('../../../server/action/raspi.js')(log4js, mockGpio, true);
      openCount = 0;
      closeCount = 0;
      writeCount = 0;

      var relay1 = 1;
      var relay2 = 8;
      var status = "FAILURE";

      var statusCodes = {
        SUCCESS: "SUCCESS",
        UNSTABLE: "UNSTABLE",
        FAILURE: "FAILURE"
      };

      tempRaspi.setStates (statusCodes);

      tempRaspi.setRelaysToStatus(relay1, relay2, status);

      assert.equal(openCount, 0);
      assert.equal(closeCount, 0);
      assert.equal(writeCount, 2);
    });

    it ('should handle an error', function () {
      var temp = mockGpio.write;
      mockGpio.write = function (pin, state, callback) {
        writeCount++;

        var error = 'some error';

        callback(error);

      };

      var tempRaspi = require('../../../server/action/raspi.js')(log4js, mockGpio, true);
      openCount = 0;
      closeCount = 0;
      writeCount = 0;

      var relay1 = 1;
      var relay2 = 8;
      var status = "FAILURE";

      var statusCodes = {
        SUCCESS: "SUCCESS",
        UNSTABLE: "UNSTABLE",
        FAILURE: "FAILURE"
      };

      tempRaspi.setStates (statusCodes);

      tempRaspi.setRelaysToStatus(relay1, relay2, status);

      assert.equal(openCount, 0);
      assert.equal(closeCount, 0);
      assert.equal(writeCount, 2);
    });
  });
});