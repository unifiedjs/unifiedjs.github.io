import {unique} from '../../util/unique.js'

export function helperReduceLicense(data, repo) {
  const {packagesByRepo, packageByName} = data
  const licenses = packagesByRepo[repo]
    .map((d) => packageByName[d].license)
    .filter(Boolean)
    .filter(unique)

  const main = licenses[0] || null

  return licenses.length > 1 ? '±' + main : main
}
