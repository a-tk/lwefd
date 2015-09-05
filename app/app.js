var express = require('express'),
    http = require('http'),
    log4js = require('log4js');

var app = express();
var log = log4js.getLogger();

var serverInfo = {
    port: 3000
};

var server = app.listen(serverInfo.port, function () {
    var host = server.address().address;
    var port = server.address().port;

    log.info('App listening on http://%s:%s', host, port);
});

app.get('/', function (req, res) {
    res.send('hello world!');
});

