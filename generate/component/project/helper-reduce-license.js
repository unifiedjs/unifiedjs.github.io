import {unique} from '../../util/unique.js'

export function helperReduceLicense(data, repo) {
  var {packagesByRepo, packageByName} = data
  var licenses = packagesByRepo[repo]
    .map((d) => packageByName[d].license)
    .filter(Boolean)
    .filter(unique)

  var main = licenses[0] || null

  return licenses.length > 1 ? '±' + main : main
}
