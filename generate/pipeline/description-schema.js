/**
 * @import {Schema} from 'hast-util-sanitize'
 */

/** @type {Schema} */
export const descriptionSchema = {
  strip: ['script'],
  ancestors: {},
  protocols: {href: ['http', 'https']},
  tagNames: ['code', 'strong', 'b', 'em', 'i', 'strike', 's', 'del', 'a'],
  attributes: {
    a: ['href'],
    '*': ['title']
  }
}
