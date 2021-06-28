import {sort} from '../../util/sort.js'
import {helperReduceScore} from './helper-reduce-score.js'

// Sort projects by score.
export function helperSort(data, names) {
  return sort(names, score)

  function score(d) {
    return helperReduceScore(data, d)
  }
}
