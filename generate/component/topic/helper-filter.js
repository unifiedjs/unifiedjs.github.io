const defaults = 1

// Filter topics for enough use.
export function helperFilter(data, names, min) {
  const {projectsByTopic} = data
  const value = min || defaults

  return names.filter(filter)

  function filter(d) {
    return (projectsByTopic[d] || []).length > value
  }
}
