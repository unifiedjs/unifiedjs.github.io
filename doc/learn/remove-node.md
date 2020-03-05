---
group: recipe
title: Remove a node
description: How to remove a node in any unified flavored syntax tree.
tags:
  - node
  - tree
  - traverse
  - walk
  - remove
  - delete
author: John Letey
published: 2020-03-05
modified: 2020-03-05
---

## How to remove a node

### Contents

*   [What is a node](#what-is-a-node)
*   [Removing a node](#removing-a-node)

### What is a node

A node is a single language specific unit inside a [syntax tree][syntax-tree].
For example: a heading in markdown, or anchor element in HTML.  In unified, nodes
follow the [unist][] specification.

### Removing a node

The concept of removing a node involves
[tree traversal][tree-traversal] of a [syntax tree][syntax-tree].

Unified compatible utilities should be used for finding a node.
Utilities are functions that work with nodes.  All specifications
that extend [unist][] can use the [unist utilities][unist-utils],
but they can also have their own utilities for more specific nodes.

To start removing nodes for your input you’ll need:

*   A processor (such as [`remark`][remark]).
*   A utility of choice.

For this example we use [`remark`][remark]
and [`unist-util-remove`][unist-util-remove].  We want to remove
all occurrences of emphasis in our markdown.

```js
var remark = require('remark')
var remove = require('unist-util-remove')

remark()
  .use(function () {
    return transformer

    function transformer(tree) {
      remove(tree, 'emphasis')
      console.dir(tree, { depth: null })
    }
  })
  .processSync('Some _emphasised_ text.')
```

yields

```js
{
  type: 'root',
  children: [
    {
      type: 'paragraph',
      children: [
        {
          type: 'text',
          value: 'Some ',
          position: Position {
            start: { line: 1, column: 1, offset: 0 },
            end: { line: 1, column: 6, offset: 5 },
            indent: []
          }
        },
        {
          type: 'text',
          value: ' text.',
          position: Position {
            start: { line: 1, column: 18, offset: 17 },
            end: { line: 1, column: 24, offset: 23 },
            indent: []
          }
        }
      ],
      position: Position {
        start: { line: 1, column: 1, offset: 0 },
        end: { line: 1, column: 24, offset: 23 },
        indent: []
      }
    }
  ],
  position: {
    start: { line: 1, column: 1, offset: 0 },
    end: { line: 1, column: 24, offset: 23 }
  }
}
```

Read more about [`unist-util-remove`][unist-util-remove] in its readme.

[tree-traversal]: https://unifiedjs.com/learn/recipe/tree-traversal/

[syntax-tree]: https://unifiedjs.com/learn/guide/introduction-to-syntax-trees/

[unist]: https://github.com/syntax-tree/unist

[unist-utils]: https://github.com/syntax-tree/unist#list-of-utilities

[remark]: https://github.com/remarkjs/remark

[unist-util-remove]: https://github.com/syntax-tree/unist-util-remove
