---
authorGithub: wooorm
author: Titus Wormer
description: How to use remark to turn markdown into HTML, and to allow embedded HTML inside markdown
group: recipe
index: 6
modified: 2024-08-02
published: 2021-03-09
tags:
  - html
  - markdown
  - parse
  - plugin
  - remark
title: HTML and remark
---

## HTML and remark

remark is a markdown compiler.
It’s focus is markdown.
It’s concerned with HTML in two ways:

1. markdown is often turned into HTML
2. markdown sometimes has embedded HTML

When dealing with HTML and markdown,
both remark and rehype are used.
This article shows some examples of how to do that.

### Contents

* [How to turn markdown into HTML](#how-to-turn-markdown-into-html)
* [How to turn HTML into markdown](#how-to-turn-html-into-markdown)
* [How to allow HTML embedded in markdown](#how-to-allow-html-embedded-in-markdown)
* [How to properly support HTML inside markdown](#how-to-properly-support-html-inside-markdown)

### How to turn markdown into HTML

remark handles markdown: it can parse and serialize it.
But it’s **not** for HTML.
That’s what rehype does, which exists to parse and serialize HTML.

To turn markdown into HTML, we need [`remark-parse`][remark-parse],
[`remark-rehype`][remark-rehype], and [`rehype-stringify`][rehype-stringify]:

```js twoslash
/// <reference types="node" />
// ---cut---
import rehypeStringify from 'rehype-stringify'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import {unified} from 'unified'

const file = await unified()
  .use(remarkParse) // Parse markdown content to a syntax tree
  .use(remarkRehype) // Turn markdown syntax tree to HTML syntax tree, ignoring embedded HTML
  .use(rehypeStringify) // Serialize HTML syntax tree
  .process('*emphasis* and **strong**')

console.log(String(file))
```

This turns `*emphasis* and **strong**` into
`<em>emphasis</em> and <strong>strong</strong>`,
but it does not support HTML embedded inside markdown
(such as `*emphasis* and <strong>strong</strong>`).

This solution **is safe**: content you don’t trust cannot cause an XSS
vulnerability.

### How to turn HTML into markdown

We can also do the inverse.
To turn HTML into markdown, we need [`rehype-parse`][rehype-parse],
[`rehype-remark`][rehype-remark], and [`remark-stringify`][remark-stringify]:

```js twoslash
/// <reference types="node" />
// ---cut---
import rehypeParse from 'rehype-parse'
import rehypeRemark from 'rehype-remark'
import remarkStringify from 'remark-stringify'
import {unified} from 'unified'

const file = await unified()
  .use(rehypeParse) // Parse HTML to a syntax tree
  .use(rehypeRemark) // Turn HTML syntax tree to markdown syntax tree
  .use(remarkStringify) // Serialize HTML syntax tree
  .process('<em>emphasis</em> and <strong>strong</strong>')

console.log(String(file))
```

This turns `<em>emphasis</em> and <strong>strong</strong>`
into `*emphasis* and **strong**`.

### How to allow HTML embedded in markdown

Markdown is a content format that’s great for the more basic things:
it’s nicer to write `*emphasis*` than `<em>emphasis</em>`.
But, it’s limited: only a couple things are supported with its terse syntax.
Luckily, for more complex things, markdown allows HTML inside it.
A common example of this is to include a `<details>` element.

HTML embedded in markdown can be allowed when going from markdown to HTML
by configuring [`remark-rehype`][remark-rehype] and
[`rehype-stringify`][rehype-stringify]:

```js twoslash
/// <reference types="node" />
// ---cut---
import rehypeStringify from 'rehype-stringify'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import {unified} from 'unified'

const file = await unified()
  .use(remarkParse)
  .use(remarkRehype, {allowDangerousHtml: true}) // Pass raw HTML strings through.
  .use(rehypeStringify, {allowDangerousHtml: true}) // Serialize the raw HTML strings
  .process('*emphasis* and <strong>strong</strong>')

console.log(String(file))
```

This solution **is not safe**: content you don’t trust can cause XSS
vulnerabilities.

### How to properly support HTML inside markdown

To properly support HTML embedded inside markdown, we need another plugin:
[`rehype-raw`][rehype-raw].
This plugin will take the strings of HTML embedded in markdown and parse them
with an actual HTML parser.

```js twoslash
/// <reference types="node" />
// ---cut---
import rehypeRaw from 'rehype-raw'
import rehypeStringify from 'rehype-stringify'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import {unified} from 'unified'

const file = await unified()
  .use(remarkParse)
  .use(remarkRehype, {allowDangerousHtml: true})
  .use(rehypeRaw) // *Parse* the raw HTML strings embedded in the tree
  .use(rehypeStringify)
  .process('*emphasis* and <strong>strong</strong>')

console.log(String(file))
```

This solution **is not safe**: content you don’t trust can cause XSS
vulnerabilities.

But because we now have a complete HTML syntax tree, we can sanitize that tree.
For a safe solution, add [`rehype-sanitize`][rehype-sanitize] right before
`rehype-stringify`.

[remark-parse]: https://github.com/remarkjs/remark/tree/main/packages/remark-parse

[remark-stringify]: https://github.com/remarkjs/remark/tree/main/packages/remark-stringify

[remark-rehype]: https://github.com/remarkjs/remark-rehype

[rehype-parse]: https://github.com/rehypejs/rehype/tree/main/packages/rehype-parse

[rehype-stringify]: https://github.com/rehypejs/rehype/tree/main/packages/rehype-stringify

[rehype-remark]: https://github.com/rehypejs/rehype-remark

[rehype-raw]: https://github.com/rehypejs/rehype-raw

[rehype-sanitize]: https://github.com/rehypejs/rehype-sanitize
