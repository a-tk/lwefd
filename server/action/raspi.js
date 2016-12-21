var raspi = (function (log4js, gpio, isRaspi) {
  var log = log4js.getLogger('raspi');
  log.setLevel('WARN');

  var states = {};

  //keeping the pin numbers internal to this class for now
  var pinMap = [7,11,12,13,15,16,18,22];
  //These pins map to relay numbers 1, 2, 3, 4, 5, 6, 7, 8 on the relay board i am using

  var openPins = function () {
    if (isRaspi == true && gpio && gpio.open) {
      var i = 0;
      for (;i < pinMap.length; i ++) {
        gpio.open(pinMap[i], "output", function (err) {
          if (err) {
            log.error('failed to open pin for write ' + err);
          } else {
            log.info('initialized pin')
          }
        });
      }

    }
  };

  var closePins = function (callback) {
    if (isRaspi == true && gpio && gpio.close) {
      var i = 0;
      for (;i < pinMap.length; i ++) {
        gpio.close(pinMap[i], function (err) {
          if (err) {
            log.error('failed to close pin ' + err);
          } else {
            log.info('closed pin');
          }
        });
      }
      setTimeout(callback, 10000);
    } else {
      callback();
    }
  };

  var setStates = function (modelStatusCodes) {
    if (modelStatusCodes && modelStatusCodes.hasOwnProperty('SUCCESS')
      && modelStatusCodes.hasOwnProperty('UNSTABLE')
      && modelStatusCodes.hasOwnProperty('FAILURE')) {
      states[modelStatusCodes.SUCCESS] = [1, 1];
      states[modelStatusCodes.UNSTABLE] = [0, 1];
      states[modelStatusCodes.FAILURE] = [0, 0];
    }
  };

  var setRelaysToStatus = function (relay1, relay2, status) {
    if (isRaspi == true && gpio && gpio.write
      && relay1 > 0 && relay2 > 0
      && relay1 < 9 && relay2 < 9
      && relay1 !== relay2
      && states.hasOwnProperty(status)) {

      setPinToState(pinMap[relay1 - 1], states[status][0]);
      setPinToState(pinMap[relay2 - 1], states[status][1]);

    }
  };

  var setPinToState = function (pin, state) {

    gpio.write(pin, state, function (err) {
      if (err) {
        log.error('failed to write pin ' + pin + 'to state ' + state);
      }
    });
  };


  return {
    openPins: openPins,
    closePins: closePins,
    setStates: setStates,
    setRelaysToStatus: setRelaysToStatus

  }
});

module.exports = raspi;
