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

function normalizeLink(link) {
  if (!link) {
    return null;
  }

  var normalizedLink = link.split('#')[0];

  return normalizedLink;
}

var Parser = {
  parse: function(currentUrl, body) {
    var htmlData = {
      url: currentUrl
    };
    var links = {};
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


    $('a').each(function(i, a) {
      var href = $(a).attr('href');
      var fullLink = normalizeLink(getFullUrl(root, path, href));
      if (fullLink && fullLink !== currentUrl) {
        links[fullLink] = links[fullLink] || 0;
        links[fullLink]++;
      }
    });

    htmlData.links = Object.keys(links);

    return htmlData;
  }
}

module.exports = Parser;
