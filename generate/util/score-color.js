'use strict'

var scale = require('d3-scale')

// https://github.com/npms-io/npms-www/blob/0324785/src/shared/components/package-score/PackageScore.js#L13
module.exports = scale.scaleLinear(
  [0, 0.5, 1],
  // Colors: red-5, yellow-5, green-5
  ['#d73a49', '#ffd33d', '#28a745']
)
