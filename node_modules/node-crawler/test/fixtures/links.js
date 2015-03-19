var duplicateLink = '<html> <body> <a href="http://test1.test">link0</a> <a href="http://test.test">link1</a> <a href="http://test.test">link2</a> </body> </html> ';
var hashLink = '<html> <body> <a href="http://test1.test">link0</a> <a href="http://test.test#hash">link1</a> <a href="http://test.test">link2</a> </body> </html> ';

module.exports = {
  duplicateLink: duplicateLink,
  hashLink: hashLink
};
