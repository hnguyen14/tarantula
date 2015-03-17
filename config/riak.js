var riak = require('nodiak').getClient(
  process.env.RIAK_BACKEND || 'http',
  process.env.RIAK_HOST || '127.0.0.1',
  process.env.RIAK_PORT || '8098'
);

module.exports = riak;
