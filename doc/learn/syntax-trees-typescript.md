---
authorGithub: ChristianMurphy
author: Christian Murphy
description: Guide that shows how to use types to work with syntax trees
group: guide
modified: 2024-08-02
published: 2020-06-09
tags:
  - hast
  - mdast
  - nlcst
  - node
  - typescript
  - types
  - unist
  - xast
title: Syntax trees in TypeScript
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

The types provided by unist are **abstract** interfaces.
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

````ts twoslash
/**
 * Info associated with nodes by the ecosystem.
 *
 * This space is guaranteed to never be specified by unist or specifications
 * implementing unist.
 * But you can use it in utilities and plugins to store data.
 *
 * This type can be augmented to register custom data.
 * For example:
 *
 * ```ts
 * declare module 'unist' {
 *   interface Data {
 *     // `someNode.data.myId` is typed as `number | undefined`
 *     myId?: number | undefined
 *   }
 * }
 * ```
 */
interface Data {}

/**
 * One place in a source file.
 */
interface Point {
  /**
   * Line in a source file (1-indexed integer).
   */
  line: number

  /**
   * Column in a source file (1-indexed integer).
   */
  column: number
  /**
   * Character in a source file (0-indexed integer).
   */
  offset?: number | undefined
}

/**
 * Position of a node in a source document.
 *
 * A position is a range between two points.
 */
interface Position {
  /**
   * Place of the first character of the parsed source region.
   */
  start: Point

  /**
   * Place of the first character after the parsed source region.
   */
  end: Point
}

/**
 * Abstract unist node.
 *
 * The syntactic unit in unist syntax trees are called nodes.
 *
 * This interface is supposed to be extended.
 * If you can use {@link Literal} or {@link Parent}, you should.
 * But for example in markdown, a `thematicBreak` (`***`), is neither literal
 * nor parent, but still a node.
 */
interface Node {
  /**
   * Node type.
   */
  type: string

  /**
   * Info from the ecosystem.
   */
  data?: Data | undefined

  /**
   * Position of a node in a source document.
   *
   * Nodes that are generated (not in the original source document) must not
   * have a position.
   */
  position?: Position | undefined
}
````

#### `Literal`

`Literal` extends `Node` and adds a `value` property.
For example a markdown `Code` node extends `Literal` and sets `value` to be a
`string`.

```ts twoslash
import type {Node} from 'unist'
// ---cut---
/**
 * Abstract unist node that contains the smallest possible value.
 *
 * This interface is supposed to be extended.
 *
 * For example, in HTML, a `text` node is a leaf that contains text.
 */
interface Literal extends Node {
  /**
   * Plain value.
   */
  value: unknown
}
```

#### `Parent`

`Parent` extends `Node` and adds `children`.
Children represent other content which is inside or a part of this node.

```ts twoslash
import type {Node} from 'unist'
// ---cut---
/**
 * Abstract unist node that contains other nodes (*children*).
 *
 * This interface is supposed to be extended.
 *
 * For example, in XML, an element is a parent of different things, such as
 * comments, text, and further elements.
 */
interface Parent extends Node {
  /**
   * List of children.
   */
  children: Node[]
}
```

#### Pulling unist into a project

Install:

```sh
npm install --save-dev @types/unist
```

To import the types into a TypeScript file, use:

```ts twoslash
import type {Literal, Node, Parent} from 'unist'
```

To import the types in [JSDoc TypeScript][ts-jsdoc], use:

```js twoslash
/**
 * @import {Literal, Node, Parent} from 'unist'
 */
```

### mdast (markdown)

[mdast][] extends unist with types specific for markdown such as
`Code`, `Heading`, `Link`, and many more.
The specification includes a full list of nodes.
The types are available in a types only package: [`@types/mdast`][ts-mdast].

Install:

```sh
npm install --save-dev @types/mdast
```

To import the types into a TypeScript file, use:

```ts twoslash
import type {Code, Heading, Link, Root} from 'mdast'
```

To import the types in [JSDoc TypeScript][ts-jsdoc], use:

```js twoslash
/**
 * @import {Code, Heading, Link, Root} from 'mdast'
 */
```

### hast (HTML)

[hast][] extends unist with types specific for HTML such as
`Comment`, `Doctype`, `Element`, and many more.
The specification includes a full list of nodes.
The types are available in a types only package: [`@types/hast`][ts-hast].

Install:

```sh
npm install --save-dev @types/hast
```

To import the types into a TypeScript file, use:

```ts twoslash
import type {Comment, Doctype, Element, Root} from 'hast'
```

To import the types in [JSDoc TypeScript][ts-jsdoc], use:

```js twoslash
/**
 * @import {Comment, Doctype, Element, Root} from 'hast'
 */
```

### xast (XML)

[xast][] extends unist with types specific for XML such as
`Cdata`, `Element`, `Instruction`, and many more.
The specification includes a full list of nodes.
The types are available in a types only package: [`@types/xast`][ts-xast].

Install:

```sh
npm install --save-dev @types/xast
```

To import the types into a TypeScript file, use:

```ts twoslash
import type {Cdata, Element, Instruction, Root} from 'xast'
```

To import the types in [JSDoc TypeScript][ts-jsdoc], use:

```js twoslash
/**
 * @import {Cdata, Element, Instruction, Root} from 'xast'
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
