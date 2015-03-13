var express = require('express');
var router = express.Router();

var dispatcher = require('../config/dispatcher');

router.get('/', function(req, res, next) {
  var allNodes = dispatcher.getAllNodes();
  res.render('admin', {title: 'Tarantula admin', cluster: allNodes});
});

module.exports = router;
