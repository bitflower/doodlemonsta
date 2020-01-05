/**
 * Monsta model events
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _events = require('events');

var Monsta = require('./monsta.model');
var MonstaEvents = new _events.EventEmitter();

// Set max event listeners (0 == unlimited)
MonstaEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Monsta.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function (doc) {
    MonstaEvents.emit(event + ':' + doc._id, doc);
    MonstaEvents.emit(event, doc);
  };
}

exports['default'] = MonstaEvents;
module.exports = exports['default'];
//# sourceMappingURL=monsta.events.js.map
