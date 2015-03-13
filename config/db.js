var Firebase = require('firebase');

var db = new Firebase(process.env.FIREBASE_URL);

db.auth(process.env.FIREBASE_SECRET, function(err) {
  if (err) {
    console.log('error authenticating with firebase', err);
  }
}, function(err) {
  if (err) {
    console.log('error authenticating with firebase', err);
  }
});

module.exports = db;
