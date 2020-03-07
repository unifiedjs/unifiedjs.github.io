'use strict'

var pick = require('pick-random')

module.exports = pickRandom

function pickRandom(list, max) {
  return list.length > max ? pick(list, {count: max}) : list
}
