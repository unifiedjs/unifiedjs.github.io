/**
 * @callback Compare
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */

/**
 * @template T
 * @callback Score
 * @param {T} value
 * @returns {number}
 */

const ascending = factory(compare)
const descending = factory(invert)

export {descending as desc, descending as sort, ascending as asc}

/**
 * @param {Compare} match
 * @returns
 *   Sort.
 */
function factory(match) {
  return sort
  /**
   * @template T
   * @param {ReadonlyArray<T>} list
   * @param {Score<T>} score
   * @returns {Array<T>}
   */
  function sort(list, score) {
    return [...list].sort(sorter)
    /**
     * @param {T} a
     * @param {T} b
     * @returns {number}
     */
    function sorter(a, b) {
      return match(score(a), score(b))
    }
  }
}

/** @type {Compare} */
function compare(a, b) {
  return a - b
}

/** @type {Compare} */
function invert(a, b) {
  return compare(b, a)
}
