var raspi = (function (log4js, gpio, isRaspi) {
  var log = log4js.getLogger('raspi');
  log.setLevel('WARN');

  var states = {};

  //keeping the pin numbers internal to this class for now
  var pinMap = [7,11,12,13,15,16,18,22];
  //These pins map to relay numbers 1, 2, 3, 4, 5, 6, 7, 8 on the relay board i am using

  var openPins = function () {
    if (isRaspi && gpio !== undefined) {
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

  var closePins = function () {
    if (isRaspi && gpio !== undefined) {
      var i = 0;
      for (;i < pinMap.length; i ++) {
        gpio.close(pinMap[i], function (err) {
          if (err) {
            log.error('failed to close pin ' + err);
          } else {
            log.info('closed pin')
          }
        });
      }
    }
  };

  var setStates = function (modelStatusCodes) {
    states[modelStatusCodes.SUCCESS] = [0, 0] ;
    states[modelStatusCodes.UNSTABLE] = [1, 0] ;
    states[modelStatusCodes.FAILURE] = [1, 1] ;
  };

  var setRelaysToStatus = function (relay1, relay2, status) {
    if (isRaspi && gpio !== undefined) {

      setPinToState(pinMap[relay1 - 1], states[status][0]);
      setPinToState(pinMap[relay2 - 1], states[status][1]);

    }
  };

  var setPinToState = function (pin, state) {
    if (state === 1 || state === 0) {

      gpio.write(pin, state, function (err) {
        if (err) {
          log.error('failed to write pin ' + pin + 'to state ' + state);
        }
      });

    } else {
      log.error('cannot assign pin ' + pin + ' to non binary state: ' + state);
    }
  };


  return {
    openPins: openPins,
    closePins: closePins,
    setStates: setStates,
    setRelaysToStatus: setRelaysToStatus

  }
});

module.exports = raspi;
