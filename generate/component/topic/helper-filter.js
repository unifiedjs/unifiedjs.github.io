var defaults = 1

// Filter topics for enough use.
export function helperFilter(data, names, min) {
  var {projectsByTopic} = data
  var value = min || defaults

  return names.filter(filter)

  function filter(d) {
    return (projectsByTopic[d] || []).length > value
  }
}
