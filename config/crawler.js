var Crawler = require('node-crawler');

var dispatcher = require('./dispatcher');
var riak = require('./riak');

var crawler = new Crawler({
  callback: function(error, htmlData) {
    if (htmlData && htmlData.url) {
      console.log('crawled', htmlData.url);
      riak.bucket('pages').objects
        .new(htmlData.url, htmlData)
        .save();
      htmlData.links.forEach(function(url) {
        dispatcher.dispatch(url);
      });
    }
  }
});

module.exports=crawler;
