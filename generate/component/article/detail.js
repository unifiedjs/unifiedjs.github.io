import h from 'hastscript'

export function detail(article) {
  return h('.content.article', article.children)
}
