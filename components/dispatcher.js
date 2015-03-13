var request = require('request');
var Promise = require('promise');

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

function addToNode(self, node) {
  var port = node.port && node.port !== 80 ? ':' + node.port : '';
  request({
    method: 'POST',
    url: getNodeDomainUrl(node) + '/cluster/addNode',
    headers: {
      'Content-Type': 'application/json'
    },
    json: self
  }, function(err, response, body) {
    if (err) {
      console.error('error adding self to', node.name);
    }
    if (body === 'OK') {
      console.log('added self to node', node.name);
    }
  });
}

Dispatcher.prototype.init = function() {
  var self = {
    name: process.env.NODE_NAME,
    domain: process.env.DOMAIN,
    port: process.env.PORT
  };
  this._cluster = {};
  this.addNode(self);
  if (!(process.env.IS_MASTER || false)) {
    request(process.env.MASTER_URL + '/cluster/getAllNodes', function(err, response, body) {
      var nodes = JSON.parse(body);
      Object.keys(nodes).forEach(function(nodeName) {
        var node = nodes[nodeName];
        this.addNode(node);
        addToNode(self, node);
      }.bind(this));
    }.bind(this));
  }
}

Dispatcher.prototype.getAllNodes = function() {
  return this._cluster;
}

Dispatcher.prototype.removeNode = function(nodeName) {
  delete this._cluster[nodeName]
}

Dispatcher.prototype.addNode = function(node) {
  if (!this._cluster[node.name]) {
    this._cluster[node.name] = node;
  }
}

Dispatcher.prototype.shutDown = function() {
  var selfName = process.env.NODE_NAME;
  return Promise.all(
    Object.keys(this._cluster).map(function(nodeName) {
      if (nodeName == selfName) return null;
      var node = this._cluster[nodeName];
      return new Promise(function(resolve, reject) {
        request({
          method: 'POST',
          url: getNodeDomainUrl(node) + '/cluster/removeNode',
          headers: {
            'Content-Type': 'application/json'
          },
          json: {
            nodeName: selfName
          }
        }, resolve);
      });
    }.bind(this))
  );
}

Dispatcher.prototype.dispatch = function(url) {
  var allNodes = Objects.keys[this._cluster];
  var hash = hashCode(url) % allNodes.length;
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

module.exports = Dispatcher;
