/// <reference lib="dom" />

/* eslint-env browser */

/**
 * @import {ElementContent} from 'hast'
 * @import {Data} from '../generate/data.js'
 * @import {Index as FlexSearch} from 'flexsearch'
 */

/**
 * @typedef Search
 * @property {HTMLElement} $scope
 * @property {(search: Search) => Promise<undefined>} create
 * @property {(data: Data, query: string) => ElementContent} empty
 * @property {((data: Data, result: ReadonlyArray<string>) => Array<string>) | undefined} [filter]
 * @property {FlexSearch} index
 * @property {(data: Data, result: ReadonlyArray<string>) => ElementContent} results
 * @property {(data: Data) => ElementContent} preview
 * @property {string} selector
 * @property {(item: string) => number} weight
 */

import {ok as assert} from 'devlop'
import flexsearch from 'flexsearch'
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
import {asc, desc} from '../generate/util/sort.js'

const Index = flexsearch.Index

const loc = window.location
const home = '/explore/'
const parameter = 'q'
const id = 'search-root'

// For some reason this can be fired multiple times.
if (loc.pathname === home && !document.querySelector('#' + id + ' form')) {
  init()
}

function init() {
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

  const promises = [
    {
      selector: '#root-keyword',
      /**
       * @param {Search} search
       * @returns {Promise<undefined>}
       */
      create(search) {
        return new Promise((resolve) => {
          window.requestAnimationFrame(() => {
            for (const d of keywords) search.index.add(d, d)
            resolve(undefined)
          })
        })
      },
      /**
       * @param {string} d
       * @returns {number}
       */
      weight(d) {
        return data.packagesByKeyword[d].length
      },
      filter: keywordFilter,
      preview: keywordPreview,
      empty: keywordEmpty,
      results: keywordResults
    },
    {
      selector: '#root-topic',
      /**
       * @param {Search} search
       * @returns {Promise<undefined>}
       */
      create(search) {
        return new Promise((resolve) => {
          window.requestAnimationFrame(() => {
            for (const d of topics) search.index.add(d, d)
            resolve(undefined)
          })
        })
      },
      /**
       * @param {string} d
       * @returns {number}
       */
      weight(d) {
        return data.projectsByTopic[d].length
      },
      filter: topicFilter,
      preview: topicPreview,
      empty: topicEmpty,
      results: topicResults
    },
    {
      selector: '#root-package',
      /**
       * @param {Search} search
       * @returns {Promise<undefined>}
       */
      create(search) {
        return new Promise((resolve) => {
          const size = 100

          window.requestAnimationFrame(() => next(0))

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
              window.requestAnimationFrame(() => next(end))
            }
          }
        })
      },
      /**
       * @param {string} d
       * @returns {number}
       */
      weight(d) {
        return data.packageByName[d].score
      },
      preview: packagePreview,
      empty: packageEmpty,
      results: packageResults
    },
    {
      selector: '#root-project',
      /**
       * @param {Search} search
       * @returns {Promise<undefined>}
       */
      create(search) {
        return new Promise((resolve) => {
          const size = 100

          window.requestAnimationFrame(() => next(0))

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
              window.requestAnimationFrame(() => next(end))
            }
          }
        })
      },
      /**
       * @param {string} d
       * @returns {number}
       */
      weight(d) {
        return helperReduceScore(data, d)
      },
      preview: projectPreview,
      empty: projectEmpty,
      results: projectResults
    }
  ].map(
    /**
     *
     * @param {Omit<Search, '$scope' | 'index'>} d
     * @returns
     */
    function (d) {
      const $scope = document.querySelector(d.selector)
      assert($scope instanceof HTMLElement)
      const index = new Index({preset: 'score', tokenize: 'full'})
      /** @type {Search} */
      const view = {...d, index, $scope}

      return view.create(view).then(() => view)
    }
  )

  Promise.all(promises).then((searches) => {
    start()

    $form.addEventListener('submit', onsubmit)
    window.addEventListener('popstate', onpopstate)

    /**
     * @returns {undefined}
     */
    function start() {
      const query = clean(new URL(loc.href).searchParams.get(parameter))

      if (query) {
        onpopstate()
      }
    }

    /**
     * @returns {undefined}
     */
    function onpopstate() {
      search(clean(new URL(loc.href).searchParams.get(parameter)))
    }

    /**
     * @param {HTMLElementEventMap['submit']} event
     * @returns {undefined}
     */
    function onsubmit(event) {
      const url = new URL(loc.href)
      const current = clean(url.searchParams.get(parameter))
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

      history.pushState(
        {},
        '',
        url.pathname + url.search.replaceAll('%20', '+')
      )

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
        search.index.searchAsync(query, {suggest: true}, (result) => {
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
  })
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
 * @param {string | null} value
 * @returns {string}
 */
function clean(value) {
  return (value || '').trim().toLowerCase()
}
