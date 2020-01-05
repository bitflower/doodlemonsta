/**
 * Main application file
 */

'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _configEnvironment = require('./config/environment');

var _configEnvironment2 = _interopRequireDefault(_configEnvironment);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

_mongoose2['default'].Promise = require('bluebird');

var autoIncrement = require('mongoose-auto-increment');
var bodyParser = require('body-parser');

// Connect to MongoDB
_mongoose2['default'].connect(_configEnvironment2['default'].mongo.uri, _configEnvironment2['default'].mongo.options);
_mongoose2['default'].connection.on('error', function (err) {
    console.error('MongoDB connection error: ' + err);
    process.exit(-1);
});

// Init Autoincrement
autoIncrement.initialize(_mongoose2['default'].connection);

// Populate databases with sample data
if (_configEnvironment2['default'].seedDB) {
    require('./config/seed');
}

// Setup server
var app = (0, _express2['default'])();
var server = _http2['default'].createServer(app);

// CORS
var allowCrossDomain = function allowCrossDomain(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Content-Length, Access-Control-Allow-Headers, Authorization");
    res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
    next();

    // res.header("Access-Control-Max-Age", "3600");
    // res.header("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
};
app.use(allowCrossDomain);

// BODY PARSER
app.use(bodyParser.json({
    limit: '2mb'
}));

// Socket IO
var socketio = require('socket.io')(server, {
    serveClient: _configEnvironment2['default'].env !== 'production',
    path: '/socket.io-client'
});
require('./config/socketio')(socketio);
require('./config/express')(app);
require('./routes')(app);

// Start server
function startServer() {
    app.angularFullstack = server.listen(_configEnvironment2['default'].port, _configEnvironment2['default'].ip, function () {
        console.log('Express server listening on %d, in %s mode', _configEnvironment2['default'].port, app.get('env'));
    });
}

setImmediate(startServer);

// Expose app
exports = module.exports = app;
//# sourceMappingURL=app.js.map
