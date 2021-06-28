import {sort} from '../../util/sort.js'

const collective = {true: 4, false: 1}
const roles = {releaser: 3, merger: 2, maintainer: 2}

// Sort humans by “influence”.
export function helperSort(data, d) {
  const scores = {}

  data.teams.forEach(team)

  return sort(d, score)

  function score(d) {
    return scores[d.github]
  }

  function team(team) {
    const members = team.humans

    Object.keys(members).forEach((d) => {
      const role = members[d]
      const active = Boolean(team.collective && role === 'maintainer')

      scores[d] = (scores[d] || 0) + (roles[role] || 1) * collective[active]
    })
  }
}
