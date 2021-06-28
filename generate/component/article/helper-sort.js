import {asc} from '../../util/sort.js'

// Sort articles by index.
export function helperSort(data) {
  return asc(data, score)
}

function score(d) {
  return (d.data.matter || {}).index || Number.POSITIVE_INFINITY
}
