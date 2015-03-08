var util = require('util');
var EventEmitter = require('events').EventEmitter;

var Events = require('./events');

function Queue() {
  this.init();
}

util.inherits(Queue, EventEmitter);

Queue.prototype.init = function() {
  this._queue = [];
}

Queue.prototype.push = function(obj) {
  var wasEmpty = !this._queue.length;
  this._queue.push(obj);
  if (wasEmpty) {
    this.emit(Events.Queue.OPEN);
  }
}

Queue.prototype.pop = function() {
  if (this._queue.length == 0) {
    return null
  }

  return this._queue.shift();
}

Queue.prototype.hasNext = function() {
  return this._queue.length;
}

module.exports = Queue;
