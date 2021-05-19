'use strict'

var h = require('hastscript')
var TimeAgo = require('javascript-time-ago')
var locale = require('../../util/constant-locale.js')
var en = require('javascript-time-ago/locale/en/index.js')

module.exports = item

var base = 'https://github.com/'

TimeAgo.addDefaultLocale(en)

var timeAgo = new TimeAgo(locale)

var dateTime = new Intl.DateTimeFormat(locale, {dateStyle: 'medium'})

function item(data, d) {
  var {packagesByRepo} = data
  var {repo, published, tag} = d
  var [owner, project] = repo.split('/')
  var url = base + repo + '/releases/tag/' + encodeURIComponent(tag)

  return h('li.block.release', [
    h('h3', [
      h('a', {href: '/explore/project/' + owner}, owner),
      h('span.lowlight.separator', '/'),
      h(
        'a',
        {
          href:
            '/explore/' +
            (!packagesByRepo[repo] || packagesByRepo[repo].length > 1
              ? 'project/' + repo
              : 'package/' + packagesByRepo[repo][0]) +
            '/'
        },
        project
      ),
      h('span.lowlight.separator', '@'),
      h('a', {href: url}, tag.replace(/v(\d+(?:\.\d+){2})/i, '$1')),
      h('span.lowlight.separator', '·'),
      h(
        'time.medlight',
        {dateTime: published, title: dateTime.format(new Date(published))},
        timeAgo.format(new Date(published))
      )
    ]),
    h(
      '.content',
      d.descriptionRich ? d.descriptionRich.children : h('p', d.description)
    )
  ])
}
