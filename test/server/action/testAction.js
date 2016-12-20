
var assert = require('assert');
var log4js = require('log4js');

var postRequestNumber;
var updateForwardCountNumber;
var createNotificationNumber;
var createdNotification;
var postData;
var postUrl;
var updatedForwardCount;
var usedPid;

var relayUpdateCount;


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

  var updateForwardCount = function (pid, count) {
    updateForwardCountNumber++;
    updatedForwardCount = count;
    usedPid = pid;
  };

  return {
    status: status,
    phase: phase,
    updateForwardCount: updateForwardCount
  };

})();

var mockRequest = (function () {

  var post = function (url, data) {
    postRequestNumber++;
    postUrl = url;
    postData = data;

  };

  return {
    post: post
  };
})();

var mockHostname = 'localhost';


var mockNotify = (function () {

  var createNotification = function (name, url, number, phase, currentStatus) {
    createNotificationNumber++;
    var note = {
      'name': name,
      'url': url,
      'number': number,
      'phase': phase,
      'status': currentStatus
    };
    createdNotification = note;
    return note;
  };

  return {
    createNotification: createNotification
  };
})();


var mockRaspi = (function () {

  var setRelaysToStatus = function (state1, state2, status) {
    relayUpdateCount++;
  };

  return {
    setRelaysToStatus: setRelaysToStatus
  };
})();

describe('action', function () {
  var action = require('../../../server/action/action.js')(log4js, mockRequest, mockHostname, mockNotify, mockRaspi, mockModel);
  describe('#sendProductStatusNotification', function () {
    it('should not send a notification if productData is NULL', function (){
      var productData = null;
      postRequestNumber = 0;
      updateForwardCountNumber = 0;
      createNotificationNumber = 0;
      createdNotification = null;
      usedPid = undefined;
      updatedForwardCount = 0;
      action.sendProductStatusNotification(productData);

      assert.equal(postRequestNumber, 0);
      assert.equal(updateForwardCountNumber, 0);
      assert.equal(createNotificationNumber, 0);
    });

    it('should not send a notification if productData is undefined', function (){
      var productData = undefined;
      postRequestNumber = 0;
      updateForwardCountNumber = 0;
      createNotificationNumber = 0;
      createdNotification = null;
      postUrl = null;
      postData = null;
      usedPid = undefined;
      updatedForwardCount = 0;
      action.sendProductStatusNotification(productData);

      assert.equal(postRequestNumber, 0);
      assert.equal(updateForwardCountNumber, 0);
      assert.equal(createNotificationNumber, 0);
    });

    it('should send a notification if productData is valid', function (){
      var productData = {
        'forwardUrl': 'www.google.com',
        'name': 'test1',
        'currentStatus': mockModel.status.SUCCESS,
        'forwardCount': 12,
        'id': 1
      };

      postRequestNumber = 0;
      updateForwardCountNumber = 0;
      createNotificationNumber = 0;
      createdNotification = null;
      postUrl = null;
      postData = null;
      usedPid = undefined;
      updatedForwardCount = 0;
      action.sendProductStatusNotification(productData);

      assert.equal(postRequestNumber, 1);
      assert.equal(updateForwardCountNumber, 1);
      assert.equal(createNotificationNumber, 1);
    });

    it('should pass the correct productData to createNotification', function (){
      var productData = {
        'forwardUrl': 'www.google.com',
        'name': 'test1',
        'currentStatus': mockModel.status.SUCCESS,
        'forwardCount': 12,
        'id': 1
      };

      postRequestNumber = 0;
      updateForwardCountNumber = 0;
      createNotificationNumber = 0;
      createdNotification = null;
      postUrl = null;
      postData = null;
      usedPid = undefined;
      updatedForwardCount = 0;
      action.sendProductStatusNotification(productData);

      assert.equal(createdNotification.name, productData.name);
      assert.equal(createdNotification.url, 'http://'+mockHostname);
      assert.equal(createdNotification.number, productData.forwardCount);
      assert.equal(createdNotification.phase, mockModel.phase.COMPLETED);
      assert.equal(createdNotification.status, productData.currentStatus);
    });

    it('should pass the correct productData to request.post', function (){
      var productData = {
        'forwardUrl': 'www.google.com',
        'name': 'test1',
        'currentStatus': mockModel.status.SUCCESS,
        'forwardCount': 12,
        'id': 1
      };

      postRequestNumber = 0;
      updateForwardCountNumber = 0;
      createNotificationNumber = 0;
      createdNotification = null;
      postUrl = null;
      postData = null;
      usedPid = undefined;
      updatedForwardCount = 0;
      action.sendProductStatusNotification(productData);

      assert.equal(productData.forwardUrl, postUrl);

      assert.equal(createdNotification.name, postData.form.name);
      assert.equal(createdNotification.url, postData.form.url);
      assert.equal(createdNotification.number, postData.form.number);
      assert.equal(createdNotification.phase, postData.form.phase);
      assert.equal(createdNotification.status, postData.form.status);
    });


    it('should pass the correct productData to model.updateForwardCount', function (){
      var productData = {
        'id': 13,
        'forwardUrl': 'www.google.com',
        'name': 'test1',
        'currentStatus': mockModel.status.SUCCESS,
        'forwardCount': 12
      };

      postRequestNumber = 0;
      updateForwardCountNumber = 0;
      createNotificationNumber = 0;
      createdNotification = null;
      postUrl = null;
      postData = null;
      usedPid = undefined;
      updatedForwardCount = 0;
      action.sendProductStatusNotification(productData);

      assert.equal(productData.id, usedPid);
      assert.equal(productData.forwardCount + 1, updatedForwardCount); //method must always increase forward count
    });
  });

  describe('#updateRaspiLights', function () {

    it('should not ever update the relays if raspi is undefined',function () {
      var tempAction = require('../../../server/action/action.js')(log4js, mockRequest, mockHostname, mockNotify, undefined, mockModel);
      relayUpdateCount = 0;
      var productData = {
        'id': 13,
        'forwardUrl': 'www.google.com',
        'name': 'test1',
        'currentStatus': mockModel.status.SUCCESS,
        'forwardCount': 12,
        'relayMapping': '1,2'
      };

      tempAction.updateRaspiLights(productData);

      assert.equal(relayUpdateCount, 0);
    });

    it('should not ever update the relays if raspi is null',function () {
      var tempAction = require('../../../server/action/action.js')(log4js, mockRequest, mockHostname, mockNotify, null, mockModel);
      relayUpdateCount = 0;
      var productData = {
        'id': 13,
        'forwardUrl': 'www.google.com',
        'name': 'test1',
        'currentStatus': mockModel.status.SUCCESS,
        'forwardCount': 12,
        'relayMapping': '1,2'
      };

      tempAction.updateRaspiLights(productData);

      assert.equal(relayUpdateCount, 0);
    });

    it('should not ever update the relays if productData is null',function () {
      relayUpdateCount = 0;
      var productData = null;

      action.updateRaspiLights(productData);

      assert.equal(relayUpdateCount, 0);
    });


    it('should not ever update the relays if productData is undefined',function () {
      relayUpdateCount = 0;
      var productData = undefined;

      action.updateRaspiLights(productData);

      assert.equal(relayUpdateCount, 0);
    });


    it('should not ever update the relays if relayMapping is null',function () {
      relayUpdateCount = 0;
      var productData = {
        'id': 13,
        'forwardUrl': 'www.google.com',
        'name': 'test1',
        'currentStatus': mockModel.status.SUCCESS,
        'forwardCount': 12,
        'relayMapping': null
      };

      action.updateRaspiLights(productData);

      assert.equal(relayUpdateCount, 0);
    });


    it('should not ever update the relays if relayMapping is undefined',function () {
      relayUpdateCount = 0;
      var productData = {
        'id': 13,
        'forwardUrl': 'www.google.com',
        'name': 'test1',
        'currentStatus': mockModel.status.SUCCESS,
        'forwardCount': 12,
        'relayMapping': undefined
      };

      action.updateRaspiLights(productData);

      assert.equal(relayUpdateCount, 0);
    });


    it('should not ever update the relays if relayMapping is not a field',function () {
      relayUpdateCount = 0;
      var productData = {
        'id': 13,
        'forwardUrl': 'www.google.com',
        'name': 'test1',
        'currentStatus': mockModel.status.SUCCESS,
        'forwardCount': 12
      };

      action.updateRaspiLights(productData);

      assert.equal(relayUpdateCount, 0);
    });


    it('should not ever update the relays if currentStatus is null',function () {
      relayUpdateCount = 0;
      var productData = {
        'id': 13,
        'forwardUrl': 'www.google.com',
        'name': 'test1',
        'currentStatus': null,
        'forwardCount': 12,
        'relayMapping': '1,2'
      };

      action.updateRaspiLights(productData);

      assert.equal(relayUpdateCount, 0);
    });


    it('should not ever update the relays if currentStatus is undefined',function () {
      relayUpdateCount = 0;
      var productData = {
        'id': 13,
        'forwardUrl': 'www.google.com',
        'name': 'test1',
        'currentStatus': undefined,
        'forwardCount': 12,
        'relayMapping': '1,2'
      };

      action.updateRaspiLights(productData);

      assert.equal(relayUpdateCount, 0);
    });


    it('should not ever update the relays if currentStatus is not a field',function () {
      relayUpdateCount = 0;
      var productData = {
        'id': 13,
        'forwardUrl': 'www.google.com',
        'name': 'test1',
        'forwardCount': 12,
        'relayMapping': '1,2'
      };

      action.updateRaspiLights(productData);

      assert.equal(relayUpdateCount, 0);
    });

    it('should update the relays with the correct information',function () {
      relayUpdateCount = 0;
      var productData = {
        'id': 13,
        'forwardUrl': 'www.google.com',
        'name': 'test1',
        'currentStatus': mockModel.status.SUCCESS,
        'forwardCount': 12,
        'relayMapping': '1,2'
      };

      action.updateRaspiLights(productData);

      assert.equal(relayUpdateCount, 1);
    });


    it('should not update the relays with too long of relayMapping',function () {
      relayUpdateCount = 0;
      var productData = {
        'id': 13,
        'forwardUrl': 'www.google.com',
        'name': 'test1',
        'currentStatus': mockModel.status.SUCCESS,
        'forwardCount': 12,
        'relayMapping': '1,2,3'
      };

      action.updateRaspiLights(productData);

      assert.equal(relayUpdateCount, 0);
    });


    it('should not update the relays with too short of relayMapping',function () {
      relayUpdateCount = 0;
      var productData = {
        'id': 13,
        'forwardUrl': 'www.google.com',
        'name': 'test1',
        'currentStatus': mockModel.status.SUCCESS,
        'forwardCount': 12,
        'relayMapping': '1,'
      };

      action.updateRaspiLights(productData);

      assert.equal(relayUpdateCount, 0);
    });


    it('should not update the relays with incorrect relay numbers',function () {
      relayUpdateCount = 0;
      var productData = {
        'id': 13,
        'forwardUrl': 'www.google.com',
        'name': 'test1',
        'currentStatus': mockModel.status.SUCCESS,
        'forwardCount': 12,
        'relayMapping': 'a,2'
      };

      action.updateRaspiLights(productData);

      assert.equal(relayUpdateCount, 0);
    });


    it('should not update the relays with incorrect relay numbers',function () {
      relayUpdateCount = 0;
      var productData = {
        'id': 13,
        'forwardUrl': 'www.google.com',
        'name': 'test1',
        'currentStatus': mockModel.status.SUCCESS,
        'forwardCount': 12,
        'relayMapping': '1,b'
      };

      action.updateRaspiLights(productData);

      assert.equal(relayUpdateCount, 0);
    });


    it('should not update the relays with too incorrect relay numbers',function () {
      relayUpdateCount = 0;
      var productData = {
        'id': 13,
        'forwardUrl': 'www.google.com',
        'name': 'test1',
        'currentStatus': mockModel.status.SUCCESS,
        'forwardCount': 12,
        'relayMapping': 'a,b'
      };

      action.updateRaspiLights(productData);

      assert.equal(relayUpdateCount, 0);
    });
  });
});