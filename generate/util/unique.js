/**
 * @template T
 * @param {T} d
 * @param {number} i
 * @param {ReadonlyArray<T>} data
 * @returns {boolean}
 */
export function unique(d, i, data) {
  return data.indexOf(d) === i
}
