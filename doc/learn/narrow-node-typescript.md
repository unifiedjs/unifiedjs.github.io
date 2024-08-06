---
authorGithub: ChristianMurphy
author: Christian Murphy
description: How to narrow generic `Node` to specific syntax types
group: recipe
index: 10
modified: 2024-08-02
published: 2020-06-09
tags:
  - node
  - typescript
  - unist
title: Narrow nodes in TypeScript
---

## How to narrow `Node`s in TypeScript

In most cases,
when working with unist (the syntax trees used by unified) in TypeScript,
one actually works with a more specific syntax tree,
such as mdast (markdown) or hast (HTML).
These syntax trees extend `Node` and add more specific types.
For example, a `Link` is a particular and more narrow `Node` in mdast
and `Element` in hast.

```ts twoslash
/// <reference types="node" />
// @errors: 2741
// ---cut---
import type {Link} from 'mdast'

// TS checks the types, here knowing that `url` is missing:
const node: Link = {type: 'link', children: []}
```

When you don’t know the exact input node, you likely still know you work with
mdast or hast or something else.
In that case, you can use the `Nodes` type (the `s` is important)
from the respective package.
That type is a discriminated union of all possible node types in that syntax
tree.
Then, regular [narrowing in TypeScript][ts-narrow] works:

```ts twoslash
/// <reference types="node" />
// ---cut---
import type {Nodes} from 'hast'

const node = {type: 'comment', value: 'Hi!'} as Nodes

if (node.type === 'comment') {
  console.log(node) // TS knows this is `Comment`.
} else {
  console.log(node) // TS knows this is *not* `Comment`.
}

if ('value' in node) {
  console.log(node) // TS knows this is `Comment` or `Text`.
} else {
  console.log(node) // TS knows this is *not* `Comment` or `Text`.
}
```

TypeScript sometimes gets confused when using a large union of many possible
nodes.
So,
when making plugins and utilities that accept syntax trees representing whole
documents,
you can use the `Root` type.

```ts twoslash
/// <reference types="node" />
// ---cut---
import type {Root} from 'mdast'
import {visit} from 'unist-util-visit'

export default function myRemarkPlugin() {
  return function (tree: Root) {
    visit(tree, 'heading', function (node) {
      node.depth += 1
    })
  }
}
```

[ts-narrow]: https://www.typescriptlang.org/docs/handbook/2/narrowing.html
