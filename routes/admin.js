var express = require('express');
var router = express.Router();

var dispatcher = require('../config/Dispatcher');

router.get('/', function(req, res, next) {
  var allNodes = dispatcher.getAllNodes();
  res.render('admin', {title: 'Tarantula admin', cluster: allNodes});
});

module.exports = router;
