var request = require('request');
var Promise = require('promise');

var db = require('../config/db');

function Dispatcher() {
  this.init();
}

function hashCode(str){
  var hash = 0;
  if (str.length == 0) return hash;
  for (i = 0; i < str.length; i++) {
    char = str.charCodeAt(i);
    hash = ((hash<<5)-hash)+char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
}

function getNodeDomainUrl(node) {
  var port = node.port && node.port !== 80 ? ':' + node.port : '';
  return 'http://' + node.domain + port;
}

Dispatcher.prototype.init = function() {
  console.log('initialized');
  var self = {
    name: process.env.NODE_NAME,
    domain: process.env.DOMAIN,
    port: process.env.PORT
  };
  db.child('nodes').on('value', function(nodesSnap) {
    this._cluster = nodesSnap.val();
  }.bind(this));
  this._cluster = {};
  db.child('nodes/' + self.name).set(self);
}

Dispatcher.prototype.getAllNodes = function() {
  return this._cluster;
}

Dispatcher.prototype.shutDown = function() {
  var selfName = process.env.NODE_NAME;
  return new Promise(function(resolve, reject) {
    db.child('nodes/' + selfName).remove(resolve);
  });
}

Dispatcher.prototype.dispatch = function(url) {
  if (url) {
    var allNodes = Object.keys(this._cluster);
    var hash = Math.abs(hashCode(url)) % allNodes.length;
    var dispatchNode = this._cluster[allNodes[hash]];
    var queueUrl = getNodeDomainUrl(dispatchNode)  + '/crawlers/queue';
    request({
      method: 'POST',
      url: queueUrl,
      headers: {
        'Content-Type': 'application/json'
      },
      json: {
        url: url
      }
    }, function(err, response, body) {
      //TODO: handle error ... then needs to remove the node and notifier the cluster
    });
  }
}

module.exports = Dispatcher;
