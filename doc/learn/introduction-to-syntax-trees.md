---
authorGithub: wooorm
author: Titus Wormer
description: Guide that shows the basics of syntax trees (ASTs)
group: guide
modified: 2024-08-14
published: 2024-08-14
tags:
  - syntax tree
  - unist
title: Intro to syntax trees
---

## Introduction to syntax trees

unified uses abstract syntax trees (abbreviated as ASTs),
that plugins can work on.
This guide introduces what ASTs are and how to work with them.

### Contents

* [What is an AST?](#what-is-an-ast)
* [What is unist?](#what-is-unist)
* [When to use an AST?](#when-to-use-an-ast)

### What is an AST?

An abstract syntax tree (AST) is a tree representation of the syntax of
programming languages.
For us that’s typically markup languages.

As a JavaScript developer you may already know things that are like ASTs:
The DOM and React’s virtual DOM.
Or you may have heard of Babel, ESLint, PostCSS, Prettier, or TypeScript.
They all use ASTs to inspect and transform code.

In unified,
we support *several* ASTs.
The reason for different ASTs is that each markup language has several aspects
that do not translate 1-to-1 to other markup languages.
Taking markdown and HTML as an example,
in some cases markdown has more info than HTML:
markdown has several ways to add a link
(“autolinks”: `<https://url>`,
resource links: `[label](url)`,
and reference links with definitions: `[label][id]` and `[id]: url`).
In other cases,
HTML has more info than markdown.
It has many tags,
which add new meaning (semantics),
that aren’t available in markdown.
If there was one AST,
it would be quite hard to do the tasks that several remark and rehype plugins
now do.

See [“How to build a syntax tree”][build-a-syntax-tree] for more info on how to
make a tree.
See [“Syntax trees in TypeScript”][syntax-trees-in-typescript] on how to work
with ASTs in TypeScript.

### What is unist?

But all our ASTs have things in common.
The bit in common is called unist.
By having a shared interface,
we can also share tools that work on all ASTs.
In practice,
that means you can use for example [`unist-util-visit`][unist-util-visit]
to visit nodes in any supported AST.

See [“Tree traversal”][tree-traversal] for more info on `unist-util-visit`.

unist is different from the ASTs used in other tools.
Quite noticeable because it uses a particular set of names for things:
`type`, `children`, `position`.
But perhaps harder to see is that it’s compatible with JSON.
It’s all objects and arrays.
Strings,
numbers.
Where other tools use instances with methods,
we use plain data.
Years ago in retext we started out like that too.
But we found that we preferred to be able to read and write a tree from/to a
JSON file,
to treat ASTs as data,
and use more functional utilities.

### When to use an AST?

You can use an AST when you want to inspect or transform content.

Say you wanted to count the number of headings in a markdown file.
You could also do that with a regex:

```js twoslash
/// <reference types="node" />
// ---cut---
const value = `# Pluto

Pluto is a dwarf planet in the Kuiper belt.

## History

### Discovery

In the 1840s, Urbain Le Verrier used Newtonian mechanics to predict the
position of…`

const expression = /^#+[^\r\n]+/gm
const headings = [...value.matchAll(expression)].length

console.log(headings) //=> 3
```

But what if the headings were in a code block?
Or if Setext headings were used instead of ATX headings?
The grammar of markdown is more complex than a regex can handle.
That’s where an AST can help.

```js twoslash
/// <reference types="node" />
// ---cut---
import {fromMarkdown} from 'mdast-util-from-markdown'
import {visit} from 'unist-util-visit'

const value = `# Pluto

Pluto is a dwarf planet in the Kuiper belt.

## History

### Discovery

In the 1840s, Urbain Le Verrier used Newtonian mechanics to predict the
position of…`

const tree = fromMarkdown(value)

let headings = 0

visit(tree, 'heading', function () {
  headings++
})

console.log(headings) //=> 3
```

See [“Tree traversal”][tree-traversal] for more info on `unist-util-visit`.

[unist-util-visit]: https://github.com/syntax-tree/unist-util-visit

[build-a-syntax-tree]: /learn/recipe/build-a-syntax-tree/

[syntax-trees-in-typescript]: /learn/guide/syntax-trees-typescript/

[tree-traversal]: /learn/recipe/tree-traversal/
