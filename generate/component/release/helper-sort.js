import {sort} from '../../util/sort.js'

// Sort releases by published.
export function helperSort(data, releases) {
  return sort(releases, score)

  function score(d) {
    return new Date(d.published)
  }
}
