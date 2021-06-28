import pick from 'pick-random'

export function pickRandom(list, max) {
  return list.length > max ? pick(list, {count: max}) : list
}
