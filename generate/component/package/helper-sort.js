import {sort} from '../../util/sort.js'

// Sort packages by score.
export function helperSort(data, names) {
  const {packageByName} = data

  return sort(names, score)

  function score(d) {
    return packageByName[d].score || 0
  }
}
