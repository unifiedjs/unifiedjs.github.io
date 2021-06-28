// 60 days.
const defaults = 60 * 24 * 60 * 60 * 1000

// Filter releases for recently published.
export function helperFilter(data, releases, ms) {
  const {projectByRepo} = data
  const value = Date.now() - (ms || defaults)

  return releases.filter(filter)

  function filter(d) {
    return projectByRepo[d.repo] && new Date(d.published) > value
  }
}
