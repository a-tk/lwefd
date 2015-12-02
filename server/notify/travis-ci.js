//travis webhook data must be converted to this
//{
// "name":"testValue",
// "valueUnit":"MPH",
// "build":{
//  "full_url":"http://localhost:3000",
//  "number":13,
//  "phase":"COMPLETED",
//  "status":"SUCCESS",
//  "value":32
//  }
//}




var travis_ci = (function (log4js) {
  var log = log4js.getLogger('travis-ci');


  return {
    transform: transform
  };

  function transform (travisData, callback) {
    var data = {};
    log.info(JSON.stringify(travisData));

    var status = 'FAILURE';

    if (travisData.payload.status_message.localeCompare('Passed') ||
      travisData.payload.status_message.localeCompare('Fixed')) {
        status = 'SUCCESS';
    } else if (travisData.payload.status_message.localeCompare('Broken') ||
      travisData.payload.status_message.localeCompare('Failed') ||
      travisData.payload.status_message.localeCompare('Still Failing')) {
      status = 'FAILURE';
    }

    var phase;
    if (travisData.payload.status_message.localeCompare('Pending')) {
      phase = 'STARTED';
    }else {
      phase = 'COMPLETED';
    }

    data.name = payload.repository.name;
    data.build = {};
    data.build.full_url = travisData.payload.build_url;
    data.build.number = travisData.payload.number;
    data.build.phase = phase;
    data.build.status = status;

    log.fatal(JSON.stringify(data));

    callback(data);

  }

});

module.exports = travis_ci;