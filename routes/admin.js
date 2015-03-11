var express = require('express');
var router = express.Router();

var dispatcher = require('../config/Dispatcher');

router.get('/', function(req, res, next) {
  res.send(dispatcher.getAllNodes());
});

module.exports = router;
