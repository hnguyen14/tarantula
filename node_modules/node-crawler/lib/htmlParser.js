var cheerio = require('cheerio')

function getFullUrl(root, path, link) {
  if (!link || link.indexOf('javascript') === 0 ||
     link.indexOf('mailto') === 0) {
    return null;
  }

  if (link.indexOf('http') === 0) {
    return link;
  }

  //absolute link
  if (link[0] === '/') {
    return root + link;
  }
  //relative link

  if (!path.length && path[path.length - 1] !== '/') {
    link = '/' + link;
  }
  return root + path + link;
}

var Parser = {
  parse: function(currentUrl, body) {
    var htmlData = {
      url: currentUrl
    };
    var $ = cheerio.load(body);
    var root, path = '';
    var pathStart = currentUrl.indexOf('/', 8);
    if (pathStart === -1) {
      root = currentUrl;
      path = '';
    } else {
      root = currentUrl.substring(0, pathStart);
      path = currentUrl.substring(pathStart, currentUrl.length);
    }

    $('style').remove();
    $('script').remove();

    htmlData.title = $('title').text();
    htmlData.content = $('body').text();

    htmlData.links = [];

    $('a').each(function(i, a) {
      var href = $(a).attr('href');
      var fullLink = getFullUrl(root, path, href);
      if (fullLink) {
        htmlData.links.push(fullLink);
      }
    });
    return htmlData;
  }
}

module.exports = Parser;
