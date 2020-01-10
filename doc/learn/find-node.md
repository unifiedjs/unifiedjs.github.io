---
group: recipe
title: Find a node
description: How to find a node in any unified flavored syntax tree.
tags:
  - node
  - tree
  - traverse
  - walk
  - find
author: Merlijn Vos
authorTwitter: Murderlon
published: 2020-01-10
modified: 2020-01-10
---

## How to find a node

### Contents

*   [What is a node](#what-is-a-node)
*   [Finding a node](#finding-a-node)

### What is a node

A node is a single language specific unit inside a [syntax tree][syntax-tree].
Such as a heading in markdown, or anchor element in HTML.  In unified, nodes
follow the [unist][] specification. 

### Finding a node

The concept of finding a node involves
[tree traversal][tree-traversal] of a [syntax tree][syntax-tree].

Unified compatible utilities should be used for finding a node.
Utilities are functions that work with nodes.  All specifications
that extend [unist][] can use the [unist utilities][unist-utils],
but they can also have their own utilities for more specific nodes.

To start finding nodes for your input your need:

*   A processor (such as [`remark`][remark]).
*   A utility of choice.

For this example we use [`remark`][remark]
and [`unist-util-find`][unist-util-find].  We want to find
the first occurrence of emphasis in our markdown.

```js
var remark = require('remark')
var find = require('unist-util-find')

remark()
  .use(function () {
    return transformer

    function transformer(tree) {
      const node = find(tree, { type: 'emphasis' })
      console.log(node)
      
    }
  })
  .processSync('Some _emphasis_, **strongness**, _more emphasis_, and `code`.')
```

yields

```js
{
  type: 'emphasis',
  children: [ { type: 'text', value: 'emphasis', position: [Position] } ],
  position: Position {
    start: { line: 1, column: 6, offset: 5 },
    end: { line: 1, column: 16, offset: 15 },
    indent: []
  }
}
```

Read more about [unist-util-find`][unist-util-find] in its readme.

[tree-traversal]: https://unifiedjs.com/learn/recipe/tree-traversal/

[syntax-tree]: https://unifiedjs.com/learn/guide/introduction-to-syntax-trees/

[unist]: https://github.com/syntax-tree/unist

[unist-utils]: https://github.com/syntax-tree/unist#list-of-utilities

[remark]: https://github.com/remarkjs/remark

[unist-util-find]: https://github.com/blahah/unist-util-find
