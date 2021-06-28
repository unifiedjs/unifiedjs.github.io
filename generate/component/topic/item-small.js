import {tag} from '../../atom/micro/tag.js'

export function itemSmall(data, d) {
  var {projectsByTopic} = data

  return tag(d, (projectsByTopic[d] || []).length, '/explore/topic/' + d + '/')
}
