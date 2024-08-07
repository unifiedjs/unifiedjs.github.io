---
authorGithub: Murderlon
authorTwitter: Murderlon
author: Merlijn Vos
description: How to find a node in any unist syntax tree
group: recipe
index: 4
modified: 2024-08-02
published: 2020-01-10
tags:
  - find
  - node
  - traverse
  - tree
  - walk
title: Find a node
---

## How to find a node

### Contents

* [What is a node](#what-is-a-node)
* [Finding a node](#finding-a-node)

### What is a node

A node is a single language specific unit inside a [syntax tree][syntax-tree].
For example: a heading in markdown, or anchor element in HTML.
In unified, nodes follow the [unist][] specification.

### Finding a node

The concept of finding a node involves
[tree traversal][tree-traversal] of a [syntax tree][syntax-tree].

unified compatible utilities should be used for finding a node.
Utilities are functions that work with nodes.
All specifications that extend [unist][] can use the
[unist utilities][unist-utils],
but they can also have their own utilities for more specific nodes.

To start finding nodes for your input you’ll need:

* a processor (such as [`remark`][remark])
* a utility of choice

For this example we use [`remark`][remark]
and [`unist-util-find`][unist-util-find].
We want to find the first occurrence of emphasis in our markdown.

```js twoslash
/// <reference types="node" />
// ---cut---
/**
 * @import {Root} from 'mdast'
 */

import {remark} from 'remark'
import {find} from 'unist-util-find'

await remark()
  .use(function () {
    /**
     * @param {Root} tree
     * @returns {undefined}
     */
    return function (tree) {
      const node = find(tree, {type: 'emphasis'})
      console.log(node)
    }
  })
  .process('Some _emphasis_, **strongness**, _more emphasis_, and `code`.')
```

…yields:

```js
{
  type: 'emphasis',
  children: [ { type: 'text', value: 'emphasis', position: [Object] } ],
  position: {
    start: { line: 1, column: 6, offset: 5 },
    end: { line: 1, column: 16, offset: 15 }
  }
}
```

Read more about [`unist-util-find`][unist-util-find] in its readme.

The package `unist-util-find` is rather basic and slow.
You likely want to [traverse a tree][tree-traversal]
with [`unist-util-visit`][unist-util-visit]

[tree-traversal]: /learn/recipe/tree-traversal/

[syntax-tree]: /learn/guide/introduction-to-syntax-trees/

[unist]: https://github.com/syntax-tree/unist

[unist-utils]: https://github.com/syntax-tree/unist#list-of-utilities

[remark]: https://github.com/remarkjs/remark

[unist-util-find]: https://github.com/syntax-tree/unist-util-find

[unist-util-visit]: https://github.com/syntax-tree/unist-util-visit
