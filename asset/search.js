/// <reference lib="dom" />

/* eslint-env browser */

/**
 * @import {ElementContent} from 'hast'
 * @import {Index as FlexSearch} from 'flexsearch'
 * @import {Data} from '../generate/data.js'
 */

/**
 * @callback Create
 * @param {Search} search
 * @returns {Promise<undefined>}
 *
 * @callback Empty
 * @param {Data} data
 * @param {string} query
 * @returns {ElementContent}
 *
 * @callback Filter
 * @param {Data} data
 * @param {ReadonlyArray<string>} result
 * @returns {Array<string>}
 *
 * @callback Preview
 * @param {Data} data
 * @returns {ElementContent}
 *
 * @callback Results
 * @param {Data} data
 * @param {ReadonlyArray<string>} result
 * @returns {ElementContent}
 *
 * @typedef Search
 * @property {HTMLElement} $scope
 * @property {Create} create
 * @property {Empty} empty
 * @property {Filter | undefined} [filter]
 * @property {FlexSearch} index
 * @property {Preview} preview
 * @property {Results} results
 * @property {string} selector
 * @property {Weight} weight
 *
 * @callback Weight
 * @param {string} item
 * @returns {number}
 */

import {ok as assert} from 'devlop'
import flexsearch from 'flexsearch'
import {toDom} from 'hast-util-to-dom'
import {helperReduceScore} from '../generate/component/project/helper-reduce-score.js'
import {searchEmpty as projectEmpty} from '../generate/component/project/search-empty.js'
import {searchPreview as projectPreview} from '../generate/component/project/search-preview.js'
import {searchResults as projectResults} from '../generate/component/project/search-results.js'
import {helperFilter as keywordFilter} from '../generate/component/keyword/helper-filter.js'
import {searchEmpty as keywordEmpty} from '../generate/component/keyword/search-empty.js'
import {searchPreview as keywordPreview} from '../generate/component/keyword/search-preview.js'
import {searchResults as keywordResults} from '../generate/component/keyword/search-results.js'
import {helperFilter as topicFilter} from '../generate/component/topic/helper-filter.js'
import {searchEmpty as topicEmpty} from '../generate/component/topic/search-empty.js'
import {searchPreview as topicPreview} from '../generate/component/topic/search-preview.js'
import {searchResults as topicResults} from '../generate/component/topic/search-results.js'
import {searchEmpty as packageEmpty} from '../generate/component/package/search-empty.js'
import {searchPreview as packagePreview} from '../generate/component/package/search-preview.js'
import {searchResults as packageResults} from '../generate/component/package/search-results.js'
import {search as searchForm} from '../generate/molecule/search.js'
import {asc, desc} from '../generate/util/sort.js'
import {data} from '../generate/data.js'

const Index = flexsearch.Index

const loc = window.location
const home = '/explore/'
const parameter = 'q'
const id = 'search-root'

// For some reason this can be fired multiple times.
if (loc.pathname === home && !document.querySelector('#' + id + ' form')) {
  init()
}

async function init() {
  const names = Object.keys(data.packageByName)
  const repos = Object.keys(data.projectByRepo)
  const keywords = Object.keys(data.packagesByKeyword)
  const topics = Object.keys(data.projectsByTopic)
  const $root = document.querySelector('#' + id)
  assert($root)
  const $form = toDom(searchForm(data, parameter))
  assert($form instanceof HTMLElement)
  const $input = $form.querySelector('[name=' + parameter + ']')
  assert($input)

  $root.prepend($form)

  /** @type {Array<Omit<Search, '$scope' | 'index'>>} */
  const rawSearches = [
    {
      /**
       * @param {Search} search
       * @returns {Promise<undefined>}
       */
      create(search) {
        return new Promise(function (resolve) {
          window.requestAnimationFrame(function () {
            for (const d of keywords) search.index.add(d, d)
            resolve(undefined)
          })
        })
      },
      empty: keywordEmpty,
      filter: keywordFilter,
      preview: keywordPreview,
      results: keywordResults,
      selector: '#root-keyword',
      /**
       * @param {string} d
       * @returns {number}
       */
      weight(d) {
        return data.packagesByKeyword[d].length
      }
    },
    {
      /**
       * @param {Search} search
       * @returns {Promise<undefined>}
       */
      create(search) {
        return new Promise(function (resolve) {
          window.requestAnimationFrame(function () {
            for (const d of topics) search.index.add(d, d)
            resolve(undefined)
          })
        })
      },
      empty: topicEmpty,
      filter: topicFilter,
      preview: topicPreview,
      results: topicResults,
      selector: '#root-topic',
      /**
       * @param {string} d
       * @returns {number}
       */
      weight(d) {
        return data.projectsByTopic[d].length
      }
    },
    {
      /**
       * @param {Search} search
       * @returns {Promise<undefined>}
       */
      create(search) {
        return new Promise(function (resolve) {
          const size = 100

          window.requestAnimationFrame(function () {
            next(0)
          })

          /**
           * @param {number} start
           * @returns {undefined}
           */
          function next(start) {
            const end = start + size
            const slice = names.slice(start, end)

            for (const d of slice)
              search.index.add(
                d,
                d.split('/').join(' ') + ' ' + data.packageByName[d].description
              )

            if (slice.length === 0) {
              resolve(undefined)
            } else {
              window.requestAnimationFrame(function () {
                next(end)
              })
            }
          }
        })
      },
      empty: packageEmpty,
      preview: packagePreview,
      results: packageResults,
      selector: '#root-package',
      /**
       * @param {string} d
       * @returns {number}
       */
      weight(d) {
        return data.packageByName[d].score
      }
    },
    {
      /**
       * @param {Search} search
       * @returns {Promise<undefined>}
       */
      create(search) {
        return new Promise(function (resolve) {
          const size = 100

          window.requestAnimationFrame(function () {
            next(0)
          })

          /**
           * @param {number} start
           * @returns {undefined}
           */
          function next(start) {
            const end = start + size
            const slice = repos.slice(start, end)

            for (const d of slice) {
              search.index.add(
                d,
                d.split('/').join(' ') + ' ' + data.projectByRepo[d].description
              )
            }

            if (slice.length === 0) {
              resolve(undefined)
            } else {
              window.requestAnimationFrame(function () {
                next(end)
              })
            }
          }
        })
      },
      empty: projectEmpty,
      preview: projectPreview,
      results: projectResults,
      selector: '#root-project',
      /**
       * @param {string} d
       * @returns {number}
       */
      weight(d) {
        return helperReduceScore(data, d)
      }
    }
  ]

  /** @type {Array<Search>} */
  const searches = []

  for (const d of rawSearches) {
    const $scope = document.querySelector(d.selector)
    assert($scope instanceof HTMLElement)
    const index = new Index({preset: 'score', tokenize: 'full'})
    /** @type {Search} */
    const view = {...d, $scope, index}

    await view.create(view)

    searches.push(view)
  }

  start()

  $form.addEventListener('submit', onsubmit)
  window.addEventListener('popstate', onpopstate)

  /**
   * @returns {undefined}
   */
  function start() {
    const query = clean(
      new URL(loc.href).searchParams.get(parameter) || undefined
    )

    if (query) {
      onpopstate()
    }
  }

  /**
   * @returns {undefined}
   */
  function onpopstate() {
    search(clean(new URL(loc.href).searchParams.get(parameter) || undefined))
  }

  /**
   * @param {HTMLElementEventMap['submit']} event
   * @returns {undefined}
   */
  function onsubmit(event) {
    const url = new URL(loc.href)
    const current = clean(url.searchParams.get(parameter) || undefined)
    assert($input instanceof HTMLInputElement)
    const value = clean($input.value)

    event.preventDefault()

    if (current === value) {
      return
    }

    if (value) {
      url.searchParams.set(parameter, value)
    } else {
      url.searchParams.delete(parameter)
    }

    history.pushState({}, '', url.pathname + url.search.replaceAll('%20', '+'))

    search(value)
  }

  /**
   * @param {string} query
   * @returns {undefined}
   */
  function search(query) {
    const $release = document.querySelector('#root-release')
    assert($release instanceof HTMLElement)
    assert($input instanceof HTMLInputElement)
    $input.value = query

    if (!query) {
      $release.style.removeProperty('display')
      for (const search of searches) replace(search, [], query)
      return
    }

    $release.style.display = 'block'

    for (const search of searches) {
      search.index.searchAsync(query, {suggest: true}, function (result) {
        const clean = [...new Set(/** @type {Array<string>} */ (result))]
        const weighted = desc(clean, function (d) {
          return search.weight(d)
        })

        replace(search, asc(clean, combined), query)

        /**
         * @param {string} d
         * @returns {number}
         */
        function combined(d) {
          return (clean.indexOf(d) + weighted.indexOf(d)) / 2
        }
      })
    }
  }
}

/**
 * @param {Search} search
 * @param {ReadonlyArray<string>} result
 * @param {string} query
 */
function replace(search, result, query) {
  const {$scope, filter, preview, empty, results} = search

  if (filter) {
    result = filter(data, result)
  }

  const $next = toDom(
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

/**
 * @param {string | undefined} value
 * @returns {string}
 */
function clean(value) {
  return (value || '').trim().toLowerCase()
}
