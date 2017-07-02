'use strict';

var SVGO = require('svgo');
var trough = require('trough');

var svgo = new SVGO({
  multipass: true
});

module.exports = trough().use(transform);

function transform(file, next) {
  svgo.optimize(file.toString('utf8'), function (res) {
    if (res.data) {
      file.contents = res.data;
    }

    next();
  });
}
