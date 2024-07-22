// To do: this is <https://github.com/rehypejs/rehype-minify/tree/main/packages/html-url-attributes>?
/**
 * @type {Record<string, ReadonlyArray<string>>}
 */
export const tagToUrl = {
  a: ['href'],
  img: ['src', 'longDesc'],
  blockquote: ['cite'],
  del: ['cite'],
  ins: ['cite'],
  q: ['cite']
}
