---
authorGithub: ChristianMurphy
author: Christian Murphy
description: How to build content with syntax trees
group: recipe
index: 8
modified: 2024-08-02
published: 2020-06-09
tags:
  - esast
  - hast
  - mdast
  - nlcst
  - unist
  - xast
title: Build a syntax tree
---

## How to build a syntax tree

It’s often useful to build new (fragments of) syntax trees when adding or
replacing content.
It’s possible to create trees with plain object and array literals (JSON) or
programmatically with a small utility.
Finally it’s even possible to use JSX to build trees.

### JSON

The most basic way to create a tree is with plain object and arrays.
To prevent type errors, this can be checked with the types for the given syntax
tree language, in this case mdast:

```ts twoslash
import type {Root} from 'mdast'

// Note the `: Root` is a TypeScript annotation.
// For plain JavaScript, remove it (and the import).
const mdast: Root = {
  type: 'root',
  children: [
    {
      type: 'paragraph',
      children: [
        {
          type: 'text',
          value: 'example'
        }
      ]
    }
  ]
}
```

#### `unist-builder`

It’s also possible to build trees with [`unist-builder`][u].
It allows a more concise, “hyperscript” like syntax (which is also like
`React.createElement`):

```js twoslash
/**
 * @import {Root} from 'mdast'
 */

import {u} from 'unist-builder'

/** @type {Root} */
const mdast = u('root', [
  u('paragraph', [
    u('text', 'example')
  ])
])
```

#### `hastscript`

When working with hast (HTML), [`hastscript`][h] can be used.

```js twoslash
/// <reference types="node" />
// ---cut---
import {h, s} from 'hastscript'

console.log(
  h('div#some-id.foo', [
    h('span', 'some text'),
    h('input', {type: 'text', value: 'foo'}),
    h('a.alpha.bravo.charlie', {download: true}, 'delta')
  ])
)

// SVG:
console.log(
  s('svg', {viewBox: '0 0 500 500', xmlns: 'http://www.w3.org/2000/svg'}, [
    s('title', 'SVG `<circle>` element'),
    s('circle', {cx: 120, cy: 120, r: 100})
  ])
)
```

`hastscript` can also be used as a JSX configuration comment:

```tsx twoslash
/// <reference types="node" />
// ---cut---
/** @jsxImportSource hastscript */

console.log(
  <form method="POST">
    <input type="text" name="foo" />
    <input type="text" name="bar" />
    <input type="submit" name="send" />
  </form>
)
```

#### `xastscript`

When working with xast (XML), [`xastscript`][x]
can be used.

```js twoslash
/// <reference types="node" />
// ---cut---
import {x} from 'xastscript'

console.log(
  x('album', {id: 123}, [
    x('name', 'Exile in Guyville'),
    x('artist', 'Liz Phair'),
    x('releasedate', '1993-06-22')
  ])
)
```

`xastscript` can also be used as a JSX configuration comment:

```tsx twoslash
/// <reference types="node" />
// ---cut---
/** @jsxImportSource xastscript */

console.log(
  <album id={123}>
    <name>Born in the U.S.A.</name>
    <artist>Bruce Springsteen</artist>
    <releasedate>1984-04-06</releasedate>
  </album>
)
```

<!-- Definitions -->

[u]: https://github.com/syntax-tree/unist-builder

[h]: https://github.com/syntax-tree/hastscript

[x]: https://github.com/syntax-tree/xastscript
