export function list(names, map, options) {
  let {max, more, trail} = options || {}
  let values = names
  const total = values.length

  if (max && total >= max) {
    trail = more(total - (max - 1), total)
    values = names.slice(0, max - 1)
  }

  const children = values.map(map)

  if (trail) {
    children.push(trail)
  }

  return children
}
