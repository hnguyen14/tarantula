var express = require('express');
var router = express.Router();

var dispatcher = require('../config/Dispatcher');

router.get('/getAllNodes', function(req, res, next) {
  res.send(dispatcher.getAllNodes());
});

router.post('/addNode', function(req, res, next) {
  dispatcher.addNode(req.body);
  res.send(200);
});

module.exports = router;