---
group: guide
title: Typing syntax trees with TypeScript
description: Guide shows how to use types packages to work with syntax trees
author: Christian Murphy
authorGithub: ChristianMurphy
tags:
  - typescript
  - unist
  - mdast
  - hast
  - xast
published: 2020-06-09
modified: 2020-06-11
---

## Working with syntax trees in TypeScript

This guide will introduce you to using unist and unified with TypeScript.

### Contents

*   [The Basics](#the-basics)
*   [UNIST](#unist)
*   [MDAST (Markdown)](#mdast-markdown)
*   [HAST (HTML)](#hast-html)
*   [XAST (XML)](#xast-xml)
*   [Summary](#summary)
*   [Next steps](#next-steps)

### The Basics

All unified syntax trees are based off [unist (**uni**versal **s**yntax **t**ree)](https://github.com/syntax-tree/unist).
The core types are available in a types only package: [`@types/unist`](https://www.npmjs.com/package/@types/unist).
The main type is `Node`.
Everything else extends it.
`Literal` and `Parent` are more practical types which also extend `Node`.

The types provided by unist are abstract interfaces.
In many cases, you will instead use more specific interfaces depending on what
language you’re working with.
Each language supported by unified, like markdown, HTML, and XML, has its own
syntax tree standard which extends `unist`.

Let’s take a look at these.

### UNIST

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

### MDAST (Markdown)

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

### HAST (HTML)

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

### XAST (XML)

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

### Summary

*   Unified provides types for each language’s syntax tree
*   These types can be import into TypeScript projects and into JSDoc projects

### Next steps

*   [Learn to traverse syntax trees with TypeScript](/learn/recipe/tree-traversal-typescript)
*   [Learn to narrow `Node` to a more specific type with TypeScript](/learn/recipe/node-type-narrowing-in-typescript)
*   [Learn to build content with syntax trees in TypeScript](/learn/recipe/build-a-syntax-tree-typescript)
