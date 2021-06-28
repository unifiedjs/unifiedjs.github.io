import unified from 'unified'
import markdown from 'remark-parse'
import gemoji from 'remark-gemoji'
import remark2rehype from 'remark-rehype'
import raw from 'rehype-raw'
import sanitize from 'rehype-sanitize'
import {descriptionSchema} from './description-schema.js'

export const description = unified()
  .use(markdown)
  .use(gemoji)
  .use(remark2rehype, {allowDangerousHtml: true})
  .use(raw)
  .use(sanitize, descriptionSchema)
  .freeze()
