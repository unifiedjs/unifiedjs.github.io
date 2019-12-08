'use strict'

var ascending = factory(compare)
var descending = factory(invert)

descending.desc = descending
ascending.desc = descending
descending.asc = ascending
ascending.asc = ascending

module.exports = descending

function factory(match) {
  return sort
  function sort(list, score) {
    return (list || []).concat().sort(sorter)
    function sorter(a, b) {
      return match(score(a), score(b))
    }
  }
}

function compare(a, b) {
  return a - b
}

function invert(a, b) {
  return compare(b, a)
}
