import {sort} from '../../util/sort.js'

// Sort keywords by occurrence.
export function helperSort(data, names) {
  const {packagesByKeyword} = data

  return sort(names, score)

  function score(d) {
    return (packagesByKeyword[d] || []).length
  }
}
