---
group: guide
title: Working with syntax trees in TypeScript
description: Guide that shows how to traverse, update, and create syntax trees in TypeScript
author: Christian Murphy
authorGithub: ChristianMurphy
tags:
  - typescript
published: 2020-06-09
modified: 2020-06-09
---

## Working with syntax trees in TypeScript

This guide will introduce you to using unist and unified with TypeScript.

### Contents

*   [The basic syntax tree types](#the-basic-syntax-tree-types)
*   [The Languages](#the-languages)
*   [How to traverse a syntax tree](#how-to-traverse-a-syntax-tree)
*   [How to narrow generic `Node` to specific syntax types](#how-to-narrow-generic-node-to-specific-syntax-types)
*   [How to build syntax tree](#how-to-build-syntax-tree)
*   [Summary](#summary)

### The basic syntax tree types

All unified syntax trees are based off [unist (**uni**versal **s**yntax **t**ree)](https://github.com/syntax-tree/unist).
The core types are available in a types only package: [`@types/unist`](https://www.npmjs.com/package/@types/unist).
The main type is `Node`.
Everything else extends it.
`Literal` and `Parent` are more practical types which also extend `Node`.

#### `Node`

`Node` is the syntactic unit of syntax trees.
Each node extends `Node` (sometimes indirectly through `Literal` or `Parent`)
and set `type` to a [string literal](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#literal-types)
The type field tells us what kind of syntax the node is.
This field uniquely identifies a kind of content (in TypeScript parlance a
[discriminated union](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions)).
For example in Markdown (mdast) `Node` will be extended to make different kinds
of content such as a `Heading` or `Link`, which respectively use a `type` field
of `'heading'` and `'link'`.

A node also can optionally include a `Data` interface at the `data` field.
This is an object (dictionary) that stores extra metadata which is not standard
to the node but defined by the ecosystem (utilities and plugins).

When a syntax tree is parsed from a file, it includes positional information:
a `Position` interface at the `position` field.
This describes where the node occurred in the source file.

```ts
/**
 * Syntactic units in unist syntax trees are called nodes.
 */
interface Node {
  /**
   * The variant of a node.
   */
  type: string

  /**
   * Information from the ecosystem.
   */
  data?: Data | undefined

  /**
   * Location of a node in a source document.
   * Must not be present if a node is generated.
   */
  position?: Position | undefined
}

/**
 * Information associated by the ecosystem with the node.
 * Space is guaranteed to never be specified by unist or specifications
 * implementing unist.
 */
export interface Data {
  [key: string]: unknown
}

/**
 * Location of a node in a source file.
 */
export interface Position {
  /**
   * Place of the first character of the parsed source region.
   */
  start: Point

  /**
   * Place of the first character after the parsed source region.
   */
  end: Point

  /**
   * Start column at each index (plus start line) in the source region,
   * for elements that span multiple lines.
   */
  indent?: number[] | undefined
}

```

#### `Literal`

`Literal` extends `Node` and adds a `value` property.
For example a markdown `code` node extends `Literal` and sets `value` to be a `string`.

```ts
/**
 * Nodes containing a value.
 */
export interface Literal extends Node {
  value: unknown
}
```

#### `Parent`

`Parent` extends `Node` and adds `children`.
Children represent other content which is inside or a part of this node.

```ts
/**
 * Nodes containing other nodes.
 */
export interface Parent extends Node {
  /**
   * List representing the children of a node.
   */
  children: Node[];
}
```

#### Pulling unist into a project

Install:

```bash
npm install --save-dev @types/unist
```

To import the types into a TypeScript file, use:

```ts
import type {Node, Literal, Parent} from 'unist'
```

or into a [JSDoc TypeScript](https://www.typescriptlang.org/docs/handbook/intro-to-js-ts.html) project with:

```js
/**
 * @typedef {import('unist').Node} Node
 * @typedef {import('unist').Literal} Literal
 * @typedef {import('unist').Parent} Parent
 */
```

### The Languages

The types provided by unist are abstract interfaces.
In many cases, you will instead use more specific interfaces depending on what
language you’re working with.
Each language supported by unified, like markdown, HTML, and XML, has its own
syntax tree standard which extends `unist`.
Let’s take a look at a few of them.

#### MDAST (Markdown)

[mdast (**m**arkdown **a**bstract **s**yntax **t**ree)](https://github.com/syntax-tree/mdast#readme)
extends unist with types specific for markdown such as `Heading`, `Code`,
`Link`, and many more.
A full list of nodes can be found in the [specification](https://github.com/syntax-tree/mdast#readme).
The types are available in a types only package: [`@types/mdast`](https://www.npmjs.com/package/@types/mdast).

Install:

```bash
npm install --save-dev @types/mdast
```

To import the types into a TypeScript file, use:

```ts
import type {Heading, Code, Link} from 'mdast'
```

To import the types in [JSDoc TypeScript](https://www.typescriptlang.org/docs/handbook/intro-to-js-ts.html), use:

```js
/**
 * @typedef {import('mdast').Heading} Heading
 * @typedef {import('mdast').Code} Code
 * @typedef {import('mdast').Link} Link
 */
```

#### HAST (HTML)

[hast (**h**ypertext **a**bstract **s**yntax **t**ree)](https://github.com/syntax-tree/hast#readme)
extends unist with types specific for HTML such as `Element`, `Comment`,
`DocType`, and many more.
A full list of nodes can be found in the [specification](https://github.com/syntax-tree/hast#readme).
The types are available in a types only package: [`@types/hast`](https://www.npmjs.com/package/@types/hast).

Install:

```bash
npm install --save-dev @types/hast
```

To import the types into a TypeScript file, use:

```ts
import type {Element, Comment, DocType} from 'hast'
```

To import the types in [JSDoc TypeScript](https://www.typescriptlang.org/docs/handbook/intro-to-js-ts.html), use:

```js
/**
 * @typedef {import('hast').Element} Element
 * @typedef {import('hast').Comment} Comment
 * @typedef {import('hast').DocType} DocType
 */
```

#### XAST (XML)

[xast (e**x**tensible **a**bstract **s**yntax **t**ree)](https://github.com/syntax-tree/xast#readme)
extends unist with types specific for HTML such as `Element`, `CData`,
`Instruction`, and many more.
A full list of nodes can be found in the [specification](https://github.com/syntax-tree/xast#readme).
The types are available in a types only package: [`@types/xast`](https://www.npmjs.com/package/@types/xast).

Install:

```bash
npm install --save-dev @types/xast
```

To import the types into a TypeScript file, use:

```ts
import type {Element, CData, Instruction} from 'xast'
```

To import the types in [JSDoc TypeScript](https://www.typescriptlang.org/docs/handbook/intro-to-js-ts.html), use:

```js
/**
 * @typedef {import('xast').Element} Element
 * @typedef {import('xast').CData} CData
 * @typedef {import('xast').Instruction} Instruction
 */
```

### How to traverse a syntax tree

:notebook: please read the [introduction to tree traversal in JavaScript](./tree-traversal/)
before reading this section.

A frequent task when working with unified is to traverse trees to find certain
nodes and then doing something with them (often validating or transforming
them).
There are several type-safe utilities provided by unified to help with this.

#### `unist-util-visit`

[`unist-util-visit`](https://github.com/syntax-tree/unist-util-visit#readme)
takes a syntax tree, a `Test`, and a callback.
The callback is called for each node in the tree that passes `Test`.

For example if we want to increasing the heading level of all headings in a
markdown document:

```ts
import remark from 'remark'
import type {Node} from 'unist'
import type {Heading} from 'mdast'
import {visit} from 'unist-util-visit'

const markdownFile = await remark()
  .use(() => (mdast: Node) => {
    visit(
      mdast,
      // Check that the Node is a heading:
      'heading',
      (node: Heading) => {
        node.depth += 1
      }
    )
  })
  .process('## Hello, *World*!')

console.log(markdownFile.toString())
```

Or if we want to make all ordered lists in a markdown document unordered:

```ts
import remark from 'remark'
import type {Node} from 'unist'
import type {List} from 'mdast'
import {visit} from 'unist-util-visit'

const markdownFile = await remark()
  .use(() => (mdast: Node) => {
    visit(
      mdast,
      // Check that the Node is a list and that it is ordered:
      {type: 'list', ordered: true},
      (node: List) => {
        node.ordered = false
      }
    )
  })
  .process('1. list item')

console.log(markdownFile.toString())
```

Or we could warn each time we find a link which has a URL that does not use
HTTPS:

```ts
import remark from 'remark'
import type {Node} from 'unist'
import type {Link} from 'mdast'
import {is} from 'unist-util-is'
import {visit} from 'unist-util-visit'

remark()
  .use(() => (mdast: Node) => {
    visit(
      mdast,
      // this both checks the node is a link and checks the content of url
      (node: Node): node is Link => is<Link>(node, 'link') && !node.url.includes('https'),
      (node: Link) => {
        console.warn('link is not https', node.url)
      }
    )
  })
  .process('[link](http://example.com)')
```

#### `unist-util-visit-parents`

Sometimes it’s needed to know the ancestors of a node (all its parents).
[`unist-util-visit-parents`](https://github.com/syntax-tree/unist-util-visit-parents)
is like `unist-util-visit` but includes a list of all parent nodes.

For example if we want to check if all markdown `ListItem` are inside a `List`
we could:

```ts
import remark from 'remark'
import type {Node, Parent} from 'unist'
import type {ListItem} from 'mdast'
import {visitParents} from 'unist-util-visit-parents'

remark()
  .use(() => (mdast: Node) => {
    visitParents(mdast, 'listItem', (listItem: ListItem, parents: Parent[]) => {
      if (!parents.some((parent) => parent.type === 'list')) {
        console.warn('listItem is outside a list')
      }
    })
  })
  .process('1. list item')
```

#### `unist-util-select`

Sometimes CSS selectors are easier to read than several (nested) if/else
statements.
[`unist-util-select`](https://github.com/syntax-tree/unist-util-select) lets
you do just that.
For example if we want to find all `Paragraph`s that are somewhere in a
`Blockquote`, we could:

```ts
import remark from 'remark'
import type {Node} from 'unist'
import {selectAll} from 'unist-util-select'

remark()
  .use(() => (mdast: Node) => {
    const matches = selectAll('blockquote paragraph', mdast)
    console.log(matches)
  })
  .process('1. list item')
```

### How to narrow generic `Node` to specific syntax types

To work with a specific node type or a set of node types we need to
[narrow](https://www.typescriptlang.org/docs/handbook/2/narrowing.html) their
type.
For example, we can take a `Node` and perform a type safe check to get a more
specific type like a `Link`.
Unified provides a utility to help with this and there are some TypeScript
language features which can also help.
Let’s first take a look at `unist-util-is`.

[`unist-util-is`](https://github.com/syntax-tree/unist-util-is#readme) takes a
`Node` and a [`Test`](https://github.com/syntax-tree/unist-util-is#isnode-test-index-parent-context)
and returns `true` if the test passes, and `false` if it does not. It also is
a [TypeScript predicate](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates)
meaning if used as the condition for an `if` statement, TypeScript knows more
about the type inside the `if`.

For example:

```ts
import type {Node, Literal} from 'unist'
import type {List, Blockquote, Strong, Emphasis, Heading} from 'mdast'
import {is, convert} from 'unist-util-is'

// `Node` could come from a plugin, a utility, or be passed into a function
// here we hard code a Node for testing purposes
const node: Node = {type: 'example'}

if (is<List>(node, 'list')) {
  // If we get here, node is List
}

if (is<Strong | Emphasis>(node, ['strong', 'emphasis'])) {
  // If we get here, node is Strong or Emphasis

  // If we want even more specific type, we can use a discriminated union
  // https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions
  if (node.type === 'emphasis') {
    // If we get here, node is Emphasis
  }
}

if (is<Heading>(node, {type: 'heading', depth: 1})) {
  // If we get here, node is Heading
}

// For advanced use cases, another predicate can be passed to `is`
if (is<Literal>(node, (node: Node): node is Literal => 'value' in node)) {
  // If we get here, node is one of the Literal types
}

// Reusable predicates can also be created using any `Test`
const isBlockquote = convert<Blockquote>('blockquote')
if (isBlockquote(node)) {
  // If we get here, node is Blockquote
}
```

### How to build syntax tree

It’s often useful to build new (fragments of) syntax trees when adding or
replacing content.
It’s possible to create trees with plain object and array literals (JSON) or
programmatically with a small utility.
Finally it’s even possible to use JSX to build trees.

#### JSON

The most basic way to create a tree is with plain object and arrays, such as:

```ts
const mdast = {
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

for some extra type safety this can be checked with the types for the given
syntax tree language, in this case MDAST:

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

### Summary

*   Using TypeScript can make finding typos and bugs easier
*   Unified provides types for each language’s syntax tree and utilities to
    work with these types
*   Types are available for most plugins and utilities (and if types haven’t
    been added a pull request is welcome!)
