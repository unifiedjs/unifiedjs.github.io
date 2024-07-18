---
group: guide
title: Syntax trees in TypeScript
description: Guide that shows how to use types to work with syntax trees
author: Christian Murphy
authorGithub: ChristianMurphy
tags:
  - typescript
  - unist
  - node
  - mdast
  - hast
  - xast
published: 2020-06-09
modified: 2020-06-15
---

## How to work with syntax trees in TypeScript

This guide will introduce you to using unist and unified with TypeScript.

### Contents

* [Basics](#basics)
* [unist](#unist)
* [mdast (markdown)](#mdast-markdown)
* [hast (HTML)](#hast-html)
* [xast (XML)](#xast-xml)
* [Summary](#summary)
* [Next steps](#next-steps)

### Basics

All unified syntax trees are based off [unist][].
The core types are available in a types only package:
[`@types/unist`][ts-unist].
The main type is `Node`.
Everything else extends it.
`Literal` and `Parent` are more specific types which also extend `Node`.

The types provided by unist are abstract interfaces.
Often, you will instead use more practical interfaces depending on what language
you’re working with.
Each language supported by unified, like markdown, HTML, and XML, has its own
syntax tree standard which extends `unist`.

Let’s take a look at these.

### unist

#### `Node`

`Node` is the syntactic unit of syntax trees.
Each node extends `Node` (sometimes through `Literal` or `Parent`) and sets
`type` to a [string literal][ts-literal].
The type field tells us what kind of content the node is.
This field uniquely identifies a kind of content.
in TypeScript that’s called a
[discriminated union][ts-discriminated-union].
For example in markdown (mdast) `Node` will be extended to make things such as a
`Heading` or `Link`, which respectively use a `type` field of `'heading'` and
`'link'`.

A node can optionally include a `Data` interface at the `data` field.
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
For example a markdown `Code` node extends `Literal` and sets `value` to be a
`string`.

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

To import the types in [JSDoc TypeScript][ts-jsdoc], use:

```js
/**
 * @typedef {import('unist').Node} Node
 * @typedef {import('unist').Literal} Literal
 * @typedef {import('unist').Parent} Parent
 */
```

### mdast (markdown)

[mdast][] extends unist with types specific for markdown such as `Heading`,
`Code`, `Link`, and many more.
The specification includes a full list of nodes.
The types are available in a types only package: [`@types/mdast`][ts-mdast].

Install:

```bash
npm install --save-dev @types/mdast
```

To import the types into a TypeScript file, use:

```ts
import type {Heading, Code, Link} from 'mdast'
```

To import the types in [JSDoc TypeScript][ts-jsdoc], use:

```js
/**
 * @typedef {import('mdast').Heading} Heading
 * @typedef {import('mdast').Code} Code
 * @typedef {import('mdast').Link} Link
 */
```

### hast (HTML)

[hast][] extends unist with types specific for HTML such as
`Element`, `Comment`, `Doctype`, and many more.
The specification includes a full list of nodes.
The types are available in a types only package: [`@types/hast`][ts-hast].

Install:

```bash
npm install --save-dev @types/hast
```

To import the types into a TypeScript file, use:

```ts
import type {Element, Comment, DocType} from 'hast'
```

To import the types in [JSDoc TypeScript][ts-jsdoc], use:

```js
/**
 * @typedef {import('hast').Element} Element
 * @typedef {import('hast').Comment} Comment
 * @typedef {import('hast').DocType} DocType
 */
```

### xast (XML)

[xast][] extends unist with types specific for XML such as
`Element`, `CData`, `Instruction`, and many more.
The specification includes a full list of nodes.
The types are available in a types only package: [`@types/xast`][ts-xast].

Install:

```bash
npm install --save-dev @types/xast
```

To import the types into a TypeScript file, use:

```ts
import type {Element, CData, Instruction} from 'xast'
```

To import the types in [JSDoc TypeScript][ts-jsdoc], use:

```js
/**
 * @typedef {import('xast').Element} Element
 * @typedef {import('xast').CData} CData
 * @typedef {import('xast').Instruction} Instruction
 */
```

### Summary

* unified provides types for each language’s syntax tree
* These types can be import into TypeScript projects and into JSDoc projects

### Next steps

* [Learn to traverse syntax trees with TypeScript](/learn/recipe/tree-traversal-typescript/)
* [Learn to narrow `Node`s](/learn/recipe/narrow-node-typescript/)
* [Learn to build syntax trees](/learn/recipe/build-a-syntax-tree/)

<!-- Definitions -->

[unist]: https://github.com/syntax-tree/unist

[mdast]: https://github.com/syntax-tree/mdast

[hast]: https://github.com/syntax-tree/hast

[xast]: https://github.com/syntax-tree/xast#readme

[ts-unist]: https://www.npmjs.com/package/@types/unist

[ts-mdast]: https://www.npmjs.com/package/@types/mdast

[ts-hast]: https://www.npmjs.com/package/@types/hast

[ts-xast]: https://www.npmjs.com/package/@types/xast

[ts-jsdoc]: https://www.typescriptlang.org/docs/handbook/intro-to-js-ts.html

[ts-discriminated-union]: https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions

[ts-literal]: https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#literal-types
