import {tag} from '../../atom/micro/tag.js'

export function itemSmall(data, d) {
  var {packagesByKeyword} = data

  return tag(
    d,
    (packagesByKeyword[d] || []).length,
    '/explore/keyword/' + d + '/'
  )
}
