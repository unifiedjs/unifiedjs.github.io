const defaults = 1

// Filter keywords for enough use.
export function helperFilter(data, names, min) {
  const {packagesByKeyword} = data
  const value = min || defaults

  return names.filter(filter)

  function filter(d) {
    return (packagesByKeyword[d] || []).length > value
  }
}
