import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import remarkGemoji from 'remark-gemoji'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import {unified} from 'unified'
import {descriptionSchema} from './description-schema.js'

export const description = unified()
  .use(remarkParse)
  .use(remarkGemoji)
  .use(remarkRehype, {allowDangerousHtml: true})
  .use(rehypeRaw)
  .use(rehypeSanitize, descriptionSchema)
  .freeze()
