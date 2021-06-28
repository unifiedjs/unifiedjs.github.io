import {tag} from '../../atom/micro/tag.js'

export function itemSmall(data, d) {
  const {projectsByTopic} = data

  return tag(d, (projectsByTopic[d] || []).length, '/explore/topic/' + d + '/')
}
