var assert = require("assert")
var htmlParser = require('../lib/htmlParser');

describe('parser', function(){
  it('should not return duplicate link', function(){
    var body = require('./fixtures/links.js').duplicateLink;
    var data = htmlParser.parse('http://current.test', body);
    assert.equal(2, data.links.length);
  });

  it('should not return link when same as current link', function() {
    var body = require('./fixtures/links.js').duplicateLink;
    var data = htmlParser.parse('http://test.test', body);
    assert.equal(1, data.links.length);
  });

  it('should handle hash link', function() {
    var body = require('./fixtures/links.js').hashLink;
    var data = htmlParser.parse('http://current.test', body);
    assert.equal(2, data.links.length);
  });
})
