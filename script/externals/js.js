'use strict'

var trough = require('trough')
var browserify = require('browserify')

module.exports = trough().use(bundle)

function bundle(file, next) {
  browserify(file.path)
    .plugin('tinyify')
    .bundle(done)

  function done(err, buf) {
    if (buf) {
      file.contents = String(buf)
    }

    next(err)
  }
}
