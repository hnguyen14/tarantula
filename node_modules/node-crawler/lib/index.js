var _ = require('underscore')._;
var request = require('request');
var cheerio = require('cheerio');
var htmlParser = require('./htmlParser');

var Queue = require('./queue');
var Events = require('./events');

function Crawler(options) {
  this.init(options)
}

Crawler.prototype.init = function(options) {
  var defaultOption = {
    callback: function(error, htmlData) {
      console.log('error', error);
      console.log(htmlData.title);
      console.log(htmlData.links.length);
    }
  }
  this._options = _.extend({}, defaultOption, options);
  this._queue = new Queue();
  this._queue.on(Events.Queue.OPEN, this._crawl.bind(this));
  this._crawling = false;
}

Crawler.prototype._crawl = function() {
  var callback = this._options.callback;
  if (this._crawling) return;
  this._crawling = true;
  var url = this._queue.pop();
  request(url, function(error, response, body) {
    if (error) {
      callback(error);
    }
    this._crawling = false;
    var htmlData = htmlParser.parse(response.request.uri.href, body);
    callback(null, htmlData);
    if (this._queue.hasNext()) {
      this._crawl();
    }
  }.bind(this));
}

Crawler.prototype.queue = function(url) {
  this._queue.push(url);
}

module.exports = Crawler;
