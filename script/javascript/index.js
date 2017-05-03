var browserify = require('browserify');

module.exports = transform;

function transform(file, cb) {
  browserify(file.path).bundle(cb);
}
