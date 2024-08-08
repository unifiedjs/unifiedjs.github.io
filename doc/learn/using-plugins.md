---
authorGithub: wooorm
authorTwitter: wooorm
author: Titus Wormer
description: How to use plugins and presets
group: guide
modified: 2024-08-08
published: 2024-08-08
tags:
  - plugin
  - preset
  - unified
  - use
title: Using plugins
---

## Using plugins

You can use plugins and presets to extend unified by calling
[`use`][unified-use] on a processor.

A small example is:

```js twoslash
/// <reference types="node" />
// ---cut---
import rehypeDocument from 'rehype-document'
import rehypeFormat from 'rehype-format'
import rehypeStringify from 'rehype-stringify'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import {read} from 'to-vfile'
import {unified} from 'unified'

const file = await read('example.md')

await unified()
  .use(remarkParse)
  .use(remarkRehype)
  .use(rehypeDocument, {title: '👋🌍'})
  .use(rehypeFormat)
  .use(rehypeStringify)
  .process(file)

console.log(String(file))
```

This example shows how several plugins are used.
It shows that the order in which plugins are used is important.
And it shows that plugins can be configured by passing options to them.
In this case,
`rehypeDocument` receives a `title` field.

Using presets is similar:

```js twoslash
/// <reference types="node" />
// ---cut---
import rehypeParse from 'rehype-parse'
import rehypePresetMinify from 'rehype-preset-minify'
import rehypeStringify from 'rehype-stringify'
import {read} from 'to-vfile'
import {unified} from 'unified'

const file = await read('example.html')

await unified()
  .use(rehypeParse)
  .use(rehypePresetMinify)
  .use(rehypeStringify)
  .process(file)

console.log(String(file))
```

Presets themselves cannot receive options.
Sometimes,
you still want to pass options to a particular plugin in a preset.
To configure a plugin in a preset,
use it after the preset,
with the correct options:

```js twoslash
/// <reference types="node" />
// ---cut---
import rehypeMinifyWhitespace from 'rehype-minify-whitespace'
import rehypeParse from 'rehype-parse'
import rehypePresetMinify from 'rehype-preset-minify'
import rehypeStringify from 'rehype-stringify'
import {read} from 'to-vfile'
import {unified} from 'unified'

const file = await read('example.html')

await unified()
  .use(rehypeParse)
  .use(rehypePresetMinify)
  .use(rehypeMinifyWhitespace, {newlines: true})
  .use(rehypeStringify)
  .process(file)

console.log(String(file))
```

[unified-use]: https://github.com/unifiedjs/unified#processoruseplugin-options
