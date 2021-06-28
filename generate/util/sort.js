const ascending = factory(compare)
const descending = factory(invert)

export {descending as desc, descending as sort, ascending as asc}

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
