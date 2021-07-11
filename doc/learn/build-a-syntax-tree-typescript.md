---
group: recipe
index: 3
title: Building a content syntax tree
description: How to build content with syntax trees
tags:
  - mdast
  - hast
  - xast
  - builder
  - hyperscript
  - jsx
author: Christian Murphy
authorGithub: ChristianMurphy
published: 2020-06-09
modified: 2020-06-11
---

## How to build syntax tree

It’s often useful to build new (fragments of) syntax trees when adding or
replacing content.
It’s possible to create trees with plain object and array literals (JSON) or
programmatically with a small utility.
Finally it’s even possible to use JSX to build trees.

### JSON

The most basic way to create a tree is with plain object and arrays, for some
extra type safety this can be checked with the types for the given syntax tree
language, in this case MDAST:

```ts
import type {Root} from 'mdast'

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

It’s also possible to build trees with [`unist-builder`](https://github.com/syntax-tree/unist-builder#readme).
It allows a more concise, hyperscript (similar to `React.createElement`) like
syntax:

```ts
import {u} from 'unist-builder'

const mdast = u('root', [
  u('paragraph', [
    u('text', 'example')
  ])
])
```

#### `hastscript`

When working with hast (HTML), [`hastscript`](https://github.com/syntax-tree/hastscript#readme)
can be used.

```ts
import {h} from 'hastscript'

console.log(
  h('div#some-id.foo', [
    h('span', 'some text'),
    h('input', {type: 'text', value: 'foo'}),
    h('a.alpha.bravo.charlie', {download: true}, 'delta')
  ])
)
```

hastscript can also be used as a JSX pragma:

```tsx
/** @jsx h @jsxFrag null */
import {h} from 'hastscript'

console.log(
  <form method="POST">
    <input type="text" name="foo" />
    <input type="text" name="bar" />
    <input type="submit" name="send" />
  </form>
)
```

#### `xastscript`

When working with xast (XML), [`xastscript`](https://github.com/syntax-tree/xastscript#readme)
can be used.

```ts
import {x} from 'xastscript'

console.log(
  x('album', {id: 123}, [
    x('name', 'Exile in Guyville'),
    x('artist', 'Liz Phair'),
    x('releasedate', '1993-06-22')
  ])
)
```

xastscript can also be used as a JSX pragma:

```tsx
/** @jsx x @jsxFrag null */
import {x} from 'xastscript'

console.log(
  <album id={123}>
    <name>Born in the U.S.A.</name>
    <artist>Bruce Springsteen</artist>
    <releasedate>1984-04-06</releasedate>
  </album>
)
```
