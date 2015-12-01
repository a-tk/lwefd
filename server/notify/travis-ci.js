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

    var status = 'FAILURE';

    if (travisData.status_message === 'Passed' ||
      travisData.status_message === 'Fixed') {
        status = 'SUCCESS';
    } else if (travisData.status_message === 'Broken' ||
      travisData.status_message === 'Broken' ||
      travisData.status_message === 'Broken') {
      status = 'FAILURE';
    }

    var phase;
    if (travisData.status_message === 'Pending') {
      phase = 'STARTED';
    }else {
      phase = 'COMPLETED';
    }

    data.name = travisData.repository.name;
    data.build = {};
    data.build.full_url = travisData.build_url;
    data.build.number = travisData.number;
    data.build.phase = phase;
    data.build.status = status;

    log.fatal(JSON.stringify(data));

    callback(data);

  }

});

module.exports = travis_ci;