// 60 days.
var defaults = 60 * 24 * 60 * 60 * 1000

// Filter releases for recently published.
export function helperFilter(data, releases, ms) {
  var {projectByRepo} = data
  var value = Date.now() - (ms || defaults)

  return releases.filter(filter)

  function filter(d) {
    return projectByRepo[d.repo] && new Date(d.published) > value
  }
}
