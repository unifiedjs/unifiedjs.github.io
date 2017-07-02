'use strict';

var trough = require('trough');
var browserify = require('browserify');
var Uglify = require('uglify-js');

module.exports = trough()
  .use(bundle)
  .use(mangle);

function bundle(file, next) {
  browserify(file.path)
    .plugin('bundle-collapser/plugin')
    .bundle(done);

  function done(err, buf) {
    if (buf) {
      file.contents = String(buf);
    }

    next(err);
  }
}

function mangle(file) {
  file.contents = Uglify.minify(file.contents, {toplevel: true}).code;
}
