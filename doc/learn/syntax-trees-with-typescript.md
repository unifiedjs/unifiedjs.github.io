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

This guide will introduce you to:

* [The basic syntax tree types](#the-basics)
  * [`Node`](#node)
  * [`Literal`](#literal)
  * [`Parent`](#parent)
* [How to include syntax tree typings for a specific language](#the-languages)
  * [MDAST (Markdown)](#mdast-markdown)
  * [HAST (HTML)](#hast-html)
  * [XAST (XML)](#xast-xml)
* [How to traverse a syntax tree](#how-to-traverse-a-syntax-tree)
  * [`unist-util-visit`](#unist-util-visit)
  * [`unist-util-visit-parents`](#unist-util-visit-parents)
  * [`unist-util-select`](#unist-util-select)
* [How to narrow generic `Node`s to specific syntax types](#how-to-narrow-generic-node-to-specific-syntax-types)
* [How to build a syntax tree](#how-to-build-syntax-tree)
  * [JSON](#json)
  * [`unist-util-builder`](#unist-util-builder)
  * [`hastscript`](#hastscript)
  * [`xastscript`](#xastscript)

### The Basics

All unified syntax trees are based off [the **Uni**versal **S**yntax **T**ree (`unist`)](https://github.com/syntax-tree/unist).
Unist is a types only package available on npm at [`@types/unist`](https://www.npmjs.com/package/@types/unist), and provides three interfaces which the rest of unified's syntax trees build on: `Node`, `Literal`, and `Parent`.

#### Node

Every unified extends `Node`, it is the syntactic unit of syntax trees.
Every `Node` must have a `type`, the `type` tells us what kind of syntax the `Node` is.
For example in Markdown (mdast) `Node` will be extended to make different kinds of content such a `heading` or a `link`, a `paragraph` or a `blockquote` (among others).
Each of these different types extend `Node` (sometimes indirectly through `Literal` or `Parent`) and set `type` to a [string literal](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#literal-types) which uniquely identifies a kind of content (in TypeScript parlance a [discriminated union](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions)).

A `Node` also can optionally include `Data`.
`Data` is a dictionary/object which can store extra information and metadata which is not standard to a given node `type`.

When a syntax tree is parsed from a file, it may include `Position`, which is information about where this `Node` is found in the source file.

```ts
/**
 * Syntactic units in unist syntax trees are called nodes.
 */
interface Node {
    /**
     * The variant of a node.
     */
    type: string;

    /**
     * Information from the ecosystem.
     */
    data?: Data | undefined;

    /**
     * Location of a node in a source document.
     * Must not be present if a node is generated.
     */
    position?: Position | undefined;
}

/**
 * Information associated by the ecosystem with the node.
 * Space is guaranteed to never be specified by unist or specifications
 * implementing unist.
 */
export interface Data {
    [key: string]: unknown;
}

/**
 * Location of a node in a source file.
 */
export interface Position {
    /**
     * Place of the first character of the parsed source region.
     */
    start: Point;

    /**
     * Place of the first character after the parsed source region.
     */
    end: Point;

    /**
     * Start column at each index (plus start line) in the source region,
     * for elements that span multiple lines.
     */
    indent?: number[] | undefined;
}
```

#### Literal

`Literal` extends `Node` and adds a `value` property.
For example a Markdown `text` `Node` extends `Literal` and sets `value` to be a `string`.

```ts
/**
 * Nodes containing a value.
 */
export interface Literal extends Node {
    value: unknown;
}
```

#### Parent


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

```bash
npm install --save-dev @types/unist
```

then import the types into a TypeScript file with:

```ts
import type {Node, Literal, Parent} from 'unist'
```

or into a [JSDoc TypeScript](https://www.typescriptlang.org/docs/handbook/intro-to-js-ts.html) project with:

```js
/**
 * @typedef {import("unist").Node} Node
 * @typedef {import("unist").Literal} Literal
 * @typedef {import("unist").Parent} Parent
 */
```

### The Languages

`unist` provides the building blocks for having consistent structure, but is often more generic than what we as developers and content authors want to work with.
We want to work with a specific language like Markdown, HTML, XML, and others.
Each of these languages has it's own syntax tree standard which extends `unist` with more specific content types.
Let's take a look at a few of Unified's compatible languages.

#### MDAST (Markdown)

The [**M**arkdown **A**bstract **S**yntax **T**ree (MDAST)](https://github.com/syntax-tree/mdast#readme) extends `unist` with types specific for Markdown such as [`Heading`](https://github.com/syntax-tree/mdast#heading), [`Code`](https://github.com/syntax-tree/mdast#code), [`Link`](https://github.com/syntax-tree/mdast#link), and many more.
A full list of node types can be found in the [MDAST documentation](https://github.com/syntax-tree/mdast#readme).
[Typings for MDAST are available on npm](https://www.npmjs.com/package/@types/mdast) can be installed with a package manager.

```bash
npm install --save-dev @types/mdast
```

then import the types into a TypeScript file with:

```ts
import type {Heading, Code, Link} from 'mdast'
```

or into a [JSDoc TypeScript](https://www.typescriptlang.org/docs/handbook/intro-to-js-ts.html) project with:

```js
/**
 * @typedef {import("mdast").Heading} Heading
 * @typedef {import("mdast").Code} Code
 * @typedef {import("mdast").Link} Link
 */
```

#### HAST (HTML)

The [**H**ypertext **A**bstract **S**yntax **T**ree (HAST)](https://github.com/syntax-tree/hast#readme) extends `unist` with types specific for HTML such as [`Element`](https://github.com/syntax-tree/hast#element), [`Comment`](https://github.com/syntax-tree/hast#comment), [`DocType`](https://github.com/syntax-tree/hast#doctype), and many more.
A full list of node types can be found in the [HAST documentation](https://github.com/syntax-tree/hast#readme).
[Typings for HAST are available on npm](https://www.npmjs.com/package/@types/hast) can be installed with a package manager.

```bash
npm install --save-dev @types/hast
```

then import the types into a TypeScript file with:

```ts
import type {Element, Comment, DocType} from 'hast'
```

or into a [JSDoc TypeScript](https://www.typescriptlang.org/docs/handbook/intro-to-js-ts.html) project with:

```js
/**
 * @typedef {import("hast").Element} Element
 * @typedef {import("hast").Comment} Comment
 * @typedef {import("hast").DocType} DocType
 */
```

#### XAST (XML)

The [E**x**tensible **A**bstract **S**yntax **T**ree (XAST)](https://github.com/syntax-tree/xast#readme) extends `unist` with types specific for XML such as [`Element`](https://github.com/syntax-tree/xast#element), [`CData`](https://github.com/syntax-tree/xast#cdata), [`Instruction`](https://github.com/syntax-tree/xast#instruction), and many more.
A full list of node types can be found in the [XAST documentation](https://github.com/syntax-tree/xast#readme).
[Typings for XAST are available on npm](https://www.npmjs.com/package/@types/xast) can be installed with a package manager.

```bash
npm install --save-dev @types/xast
```

then import the types into a TypeScript file with:

```ts
import type {Element, CData, Instruction} from 'xast'
```

or into a [JSDoc TypeScript](https://www.typescriptlang.org/docs/handbook/intro-to-js-ts.html) project with:

```js
/**
 * @typedef {import("xast").Element} Element
 * @typedef {import("xast").CData} CData
 * @typedef {import("xast").Instruction} Instruction
 */
```

### How to traverse a syntax tree

Once you have a syntax tree, often through using a parser such as `remark` for MDAST or `rehype` for HAST.
You want to be able to do something with that tree, often that includes finding specific types of content, then changing the content, validating or linting the content, or transforming the content.
To do this we need to be able to traverse the syntax tree looking for content.
Unified provides several type safe utilities which can help with this.

#### `unist-util-visit`

[`unist-util-visit`](https://github.com/syntax-tree/unist-util-visit#readme) takes a syntax tree, a [`Test`](https://github.com/syntax-tree/unist-util-is#use), and a callback.
The callback will be called for each `Node` in the tree that passes the `Test`.

For example if we want to increasing the heading level of all headings in a Markdown document:

```ts
import remark from 'remark'
import type {Node} from 'unist'
import type {Heading} from 'mdast'
import {visit} from 'unist-util-visit'

const markdownFile = await remark()
  .use(() => (mdast: Node) => {
    visit(
      mdast,
      // checks that the Node is a heading
      'heading',
      (node: Heading) => {
        node.depth += 1
      }
    )
  })
  .process('## Hello, *World*!')

console.log(markdownFile.toString())
```

Or if we want to make all ordered lists in a Markdown document unordered:

```ts
import remark from 'remark'
import type {Node} from 'unist'
import type {List} from 'mdast'
import {visit} from 'unist-util-visit'

const markdownFile = await remark()
  .use(() => (mdast: Node) => {
    visit(
      mdast,
      // this checks both that the Node is a list and that it is ordered
      {type: 'list', ordered: true},
      (node: List) => {
        node.ordered = false
      }
    )
  })
  .process('1. list item')

console.log(markdownFile.toString())
```

Or we could want on all links which are not HTTPS:

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

Sometimes in addition to wanting to find a `Node` you also need to know the `Node`s higher in the tree, it's parents.
[`unist-util-visit-parents`](https://github.com/syntax-tree/unist-util-visit-parents) is similar to `unist-util-visit`, but also includes a list of parent nodes.

For example if we want to check if all Markdown `ListItem` are inside a `List` we could:

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

In some cases it can be useful to find a `Node` relative to nearby `Nodes`.
[`unist-util-select`](https://github.com/syntax-tree/unist-util-select) let's us use [CSS selectors](https://github.com/syntax-tree/unist-util-select#support) to find `Node`s in a syntax tree.
For example in Markdown if we want to find all the `Paragraph`s inside `BlockQuote`s, we could:

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

Unified works with many languages, and can pull content from strings, from files, and from virtual files.
In many cases unified doesn't know what specific `type` a `Node` will be ahead of time.
To work with a specific `Node` `type` or a small set of `Node` `types` we need to [narrow](https://www.typescriptlang.org/docs/handbook/2/narrowing.html) the type, taking the more general `Node` and doing type safe checks to get to a more specific type like a `Link`.
Unified provides several utilities to help with this, and there are some TypeScript language features which can also help. Let's take a look at `unist-util-is`.

[`unist-util-is`](https://github.com/syntax-tree/unist-util-is#readme) takes a `Node` and a [`Test`](https://github.com/syntax-tree/unist-util-is#isnode-test-index-parent-context) and returns `true` if the test passes, and `false` if it does not. It also is a [TypeScript predicate](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates) meaning if it is used as the condition for an `if` statement, TypeScript knows more about the type inside the `if`.

For example:

```ts
import type {Node, Literal} from 'unist'
import type {List, Blockquote, Strong, Emphasis, Heading} from 'mdast'
import {is, convert} from 'unist-util-is'

// `Node` could come from a plugin, a utility, or be passed into a function
// here we hard code a Node for testing purposes
const node: Node = {type: 'example'}

if (is<List>(node, 'list')) {
  // if we get here, node is List
}

if (is<Strong | Emphasis>(node, ['strong', 'emphasis'])) {
  // if we get here, node is Strong or Emphasis

  // if we want even more specific type, we can use a discriminated union
  // https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions
  if (node.type === 'emphasis') {
    // if we get here, node is Emphasis
  }
}

if (is<Heading>(node, {type: 'heading', depth: 1})) {
  // if we get here, node is Heading
}

// for advanced use cases, another predicate can be passed to `is`
if (is<Literal>(node, (node: Node): node is Literal => "value" in node)) {
  // if we get here, node is one of the Literal types
}

// reusable predicates can also be created using any `Test`
const isBlockquote = convert('blockquote')
if (isBlockquote(node)) {
  // if we get here, node is Blockquote
}
```

### How to build syntax tree

When content needs to be created or added, it's often useful to build new syntax trees, or fragments of syntax trees.
This can be easy to do with plain JSON, unified also offers some utilities for building trees with hyperscript or JSX.

### JSON

In many cases a tree can be created with plain JSON, for example:

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

for some extra type safety this can be checked with the types for the given syntax tree language, in this case `mdast`:

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

#### `unist-util-builder`

For more concise, hyperscript (or [`React.createElement`](https://reactjs.org/docs/react-api.html#createelement)) like syntax, [`unist-builder`](https://github.com/syntax-tree/unist-builder#readme) can be use:

```ts
import {u} from 'unist-builder'

const mdast = u('root', [
  u('paragraph', [
    u('text', 'example')
  ])
])
```

#### `hastscript`

For working with an HTML AST (HAST) it can be more familiar to work with [JSX](https://reactjs.org/docs/introducing-jsx.html), [`hastscript`](https://github.com/syntax-tree/hastscript#readme) provide familiar syntax:

```tsx
/* @jsxRuntime automatic */
/* @jsxImportSource hastscript */
/* @jsxFrag null */

console.log(
  <div class="foo" id="some-id">
    <span>some text</span>
    <input type="text" value="foo" />
    <a class="alpha bravo charlie" download>
      deltaecho
    </a>
  </div>
)

console.log(
  <form method="POST">
    <input type="text" name="foo" />
    <input type="text" name="bar" />
    <input type="submit" name="send" />
  </form>
)
```

#### `xastscript`

Similarly for an XML AST (XAST). [`xastscript`](https://github.com/syntax-tree/xastscript#readme) provide familiar syntax:

```tsx
/* @jsxRuntime automatic */
/* @jsxImportSource xastscript */
/* @jsxFrag null */

console.log(
  <album id={123}>
    <name>Born in the U.S.A.</name>
    <artist>Bruce Springsteen</artist>
    <releasedate>1984-04-06</releasedate>
  </album>
)
```
