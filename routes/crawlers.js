var express = require('express');
var router = express.Router();

var crawler = require('../config/Crawler');

router.post('/queue', function(req, res, next) {
  crawler.queue(req.body.url);
  res.send(200);
});

module.exports = router;
