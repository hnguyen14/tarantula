var request = require('request');

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

function addToNode(self, node) {
  var port = node.port && node.port !== 80 ? ':' + node.port : '';
  request({
    method: 'POST',
    url: 'http://' + node.domain + port + '/cluster/addNode',
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

Dispatcher.prototype.removeNode = function() {
  // TODO: remove node from local list and broadcast to the rest of the cluster
}

Dispatcher.prototype.addNode = function(node) {
  if (!this._cluster[node.name]) {
    this._cluster[node.name] = node;
  }
}

Dispatcher.prototype.dispatch = function(url) {
  var allNodes = Objects.keys[this._cluster];
  var hash = hashCode(url) % allNodes.length;
  var dispatchNode = this._cluster[allNodes[hash]];
  var port = dispatchNode.port && dispatchNode.port !== '80' ? ':' + dispatchNode.port : ''
  var queueUrl = 'http://' + dispatchNode.domain + port  + '/crawlers/queue';
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
