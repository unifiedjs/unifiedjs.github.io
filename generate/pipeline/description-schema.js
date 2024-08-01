/**
 * @import {Schema} from 'hast-util-sanitize'
 */

/** @type {Schema} */
export const descriptionSchema = {
  ancestors: {},
  attributes: {'*': ['title'], a: ['href']},
  protocols: {href: ['https', 'http']},
  strip: ['script'],
  tagNames: ['a', 'b', 'code', 'del', 'em', 'i', 'strike', 'strong', 's']
}
