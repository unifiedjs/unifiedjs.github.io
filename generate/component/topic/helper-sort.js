import {sort} from '../../util/sort.js'

// Sort topics by occurrence.
export function helperSort(data, names) {
  var {projectsByTopic} = data

  return sort(names, score)

  function score(d) {
    return (projectsByTopic[d] || []).length
  }
}
