/* eslint-env browser */

import {Index} from 'flexsearch'
import mean from 'compute-mean'
import {toDom} from 'hast-util-to-dom'
import {data} from '../generate/data.js'
import {search as searchForm} from '../generate/molecule/search.js'
import {helperReduceScore} from '../generate/component/project/helper-reduce-score.js'
import {helperFilter as keywordFilter} from '../generate/component/keyword/helper-filter.js'
import {searchPreview as keywordPreview} from '../generate/component/keyword/search-preview.js'
import {searchEmpty as keywordEmpty} from '../generate/component/keyword/search-empty.js'
import {searchResults as keywordResults} from '../generate/component/keyword/search-results.js'
import {helperFilter as topicFilter} from '../generate/component/topic/helper-filter.js'
import {searchPreview as topicPreview} from '../generate/component/topic/search-preview.js'
import {searchEmpty as topicEmpty} from '../generate/component/topic/search-empty.js'
import {searchResults as topicResults} from '../generate/component/topic/search-results.js'
import {searchPreview as packagePreview} from '../generate/component/package/search-preview.js'
import {searchEmpty as packageEmpty} from '../generate/component/package/search-empty.js'
import {searchResults as packageResults} from '../generate/component/package/search-results.js'
import {searchPreview as projectPreview} from '../generate/component/project/search-preview.js'
import {searchEmpty as projectEmpty} from '../generate/component/project/search-empty.js'
import {searchResults as projectResults} from '../generate/component/project/search-results.js'
import {unique} from '../generate/util/unique.js'
import {asc, desc} from '../generate/util/sort.js'

var loc = window.location
var home = '/explore/'
var parameter = 'q'
var id = 'search-root'

// For some reason this can be fired multiple times.
if (loc.pathname === home && !document.querySelector('#' + id + ' form')) {
  init()
}

function init() {
  var names = Object.keys(data.packageByName)
  var repos = Object.keys(data.projectByRepo)
  var keywords = Object.keys(data.packagesByKeyword)
  var topics = Object.keys(data.projectsByTopic)
  var $root = document.querySelector('#' + id)
  var $form = toDom(searchForm(data, parameter))
  var $input = $form.querySelector('[name=' + parameter + ']')

  $root.prepend($form)

  var promises = [
    {
      selector: '#root-keyword',
      create: (search) =>
        new Promise((resolve) => {
          window.requestAnimationFrame(() => {
            keywords.forEach((d) => search.index.add(d, d))
            resolve()
          })
        }),
      weight: (d) => data.packagesByKeyword[d].length,
      filter: keywordFilter,
      preview: keywordPreview,
      empty: keywordEmpty,
      results: keywordResults
    },
    {
      selector: '#root-topic',
      create: (search) =>
        new Promise((resolve) => {
          window.requestAnimationFrame(() => {
            topics.forEach((d) => search.index.add(d, d))
            resolve()
          })
        }),
      weight: (d) => data.projectsByTopic[d].length,
      filter: topicFilter,
      preview: topicPreview,
      empty: topicEmpty,
      results: topicResults
    },
    {
      selector: '#root-package',
      create: (search) =>
        new Promise((resolve) => {
          var size = 100

          window.requestAnimationFrame(() => next(0))

          function next(start) {
            var end = start + size
            var slice = names.slice(start, end)

            slice.forEach((d) =>
              search.index.add(
                d,
                d.split('/').join(' ') + ' ' + data.packageByName[d].description
              )
            )

            if (slice.length === 0) {
              resolve()
            } else {
              window.requestAnimationFrame(() => next(end))
            }
          }
        }),
      weight: (d) => data.packageByName[d].score,
      preview: packagePreview,
      empty: packageEmpty,
      results: packageResults
    },
    {
      selector: '#root-project',
      create: (search) =>
        new Promise((resolve) => {
          var size = 100

          window.requestAnimationFrame(() => next(0))

          function next(start) {
            var end = start + size
            var slice = repos.slice(start, end)

            slice.forEach((d) => {
              search.index.add(
                d,
                d.split('/').join(' ') + ' ' + data.projectByRepo[d].description
              )
            })

            if (slice.length === 0) {
              resolve()
            } else {
              window.requestAnimationFrame(() => next(end))
            }
          }
        }),
      weight: (d) => helperReduceScore(data, d),
      preview: projectPreview,
      empty: projectEmpty,
      results: projectResults
    }
  ].map((d) => {
    var $scope = document.querySelector(d.selector)
    var index = new Index({preset: 'score', tokenize: 'full'})
    var view = {...d, index, $scope}

    return view.create(view).then(() => view)
  })

  Promise.all(promises).then((searches) => {
    start()

    $form.addEventListener('submit', onsubmit)
    window.addEventListener('popstate', onpopstate)

    function start() {
      var query = clean(new URL(loc).searchParams.get(parameter))

      if (query) {
        onpopstate()
      }
    }

    function onpopstate() {
      search(clean(new URL(loc).searchParams.get(parameter)))
    }

    function onsubmit(ev) {
      var url = new URL(loc)
      var current = clean(url.searchParams.get(parameter))
      var value = clean($input.value)

      ev.preventDefault()

      if (current === value) {
        return
      }

      if (value) {
        url.searchParams.set(parameter, value)
      } else {
        url.searchParams.delete(parameter)
      }

      history.pushState(
        {},
        null,
        url.pathname + url.search.replace(/%20/g, '+')
      )

      search(value)
    }

    function search(query) {
      $input.value = query

      if (!query) {
        document.querySelector('#root-release').style = ''
        searches.forEach((search) => replace(search, [], query))
        return
      }

      document.querySelector('#root-release').style = 'display:none'

      searches.forEach((search) => {
        search.index.searchAsync(query, {suggest: true}, function (result) {
          var clean = result.filter(unique)
          var weighted = desc(clean, weight)

          replace(search, asc(clean, combined), query)

          function combined(d) {
            return mean([clean.indexOf(d), weighted.indexOf(d)])
          }
        })

        function weight(d) {
          return search.weight(d)
        }
      })
    }
  })
}

function replace(search, result, query) {
  var {$scope, filter, preview, empty, results} = search

  if (filter) {
    result = filter(data, result)
  }

  var $next = toDom(
    result.length === 0
      ? query
        ? empty(data, query)
        : preview(data)
      : results(data, result)
  )

  while ($scope.firstChild) {
    $scope.firstChild.remove()
  }

  $scope.append($next)
}

function clean(value) {
  return (value || '').trim().toLowerCase()
}
