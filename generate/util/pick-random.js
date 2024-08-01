import pickRandom_ from 'pick-random'

/**
 * @template T
 * @param {ReadonlyArray<T>} list
 * @param {number} max
 * @returns {Array<T>}
 */
export function pickRandom(list, max) {
  return list.length > max ? pickRandom_(list, {count: max}) : [...list]
}
