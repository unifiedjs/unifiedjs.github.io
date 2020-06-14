'use strict'

var sort = require('../../util/sort')

module.exports = sorter

var collective = {true: 4, false: 1}
var roles = {releaser: 3, merger: 2, maintainer: 2}

// Sort humans by “influence”.
function sorter(data, d) {
  var scores = {}

  data.teams.forEach(team)

  return sort(d, score)

  function score(d) {
    return scores[d.github]
  }

  function team(team) {
    var members = team.humans

    Object.keys(members).forEach((d) => {
      var role = members[d]
      var active = Boolean(team.collective && role === 'maintainer')

      scores[d] = (scores[d] || 0) + (roles[role] || 1) * collective[active]
    })
  }
}
