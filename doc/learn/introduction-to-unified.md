---
authorGithub: Murderlon
authorTwitter: Murderlon
author: Merlijn Vos
description: Guide that summarizes the what and why of unified
group: guide
index: 1
modified: 2024-08-02
published: 2019-12-12
tags:
  - introduction
  - welcome
title: Intro to unified
---

## Intro to unified

After reading this guide you will:

* understand what unified does
* get a taste of the ecosystem
* know how it can be used
* know what parts you need for your use case
* have a list of resources to continue learning or get started

### Contents

* [Intro](#intro)
* [Collective](#collective)
* [How it comes together](#how-it-comes-together)
* [Use cases](#use-cases)
* [Summary](#summary)
* [Next steps](#next-steps)

### Intro

unified is a friendly interface backed by an ecosystem of plugins built for
creating and manipulating content.
It does this by taking markdown, HTML, plain text, or other content,
then turning it into structured data,
thus making it available to over 100 plugins.
Plugins for example do tasks such as spellchecking, linting, or minifying.

With unified you don’t manually handle syntax or parsing.
Instead you typically write one line of code to chain a plugin into unified’s
process.

unified itself is a rather small module that acts as an interface to unify the
handling of different content formats.
Around a certain format there sits an ecosystem.
Such as remark for markdown.
Several ecosystems exist for unified.
Together with other tools and specifications they form the unified collective.

### Collective

The unified collective spans like-minded organizations.
These organizations have the shared goal to innovate content processing.
Seamless, interchangeable, and plugable tooling is how that’s achieved.

Depending on what you want to do you reference different organizations.
So let’s start off with an introduction round.

The ecosystems:

* redot — Graphviz
* rehype — HTML
* remark — markdown
* retext — natural language

The specifications for syntax trees:

* esast — ECMAScript
* hast — HTML
* mdast — markdown
* nlcst — natural language
* unist — universal syntax tree
* xast — XML

Other building blocks:

* MDX — markdown and JSX
* micromark — small, safe, and great CommonMark (and GFM) markdown parser
* syntax-tree — low-level utilities for building plugins
* vfile — virtual file format for text processing

We’ll get to how these come together in the next section.
If you are already feeling adventurous,
you can go directly to
*[Using unified][using-unified]* or
*[How to get started with plugins][using-plugins]*.

### How it comes together

These processors, specifications, and tools come together in a three part act.
The process of a processor:

1. **parse**:
   whether your input is markdown, HTML, or prose,
   it needs to be parsed to a workable format;
   such a format is called a syntax tree;
   the specifications (for example mdast) define how such a tree looks;
   the processors (such as remark for mdast) are responsible for creating them
2. **transform**:
   this is where the magic happens;
   users compose plugins and the order they run in;
   plugins plug into this phase and transform and inspect the format they get
3. **stringify**:
   the final step is to take the (adjusted) format and stringify it to
   markdown, HTML, or prose (which could be different from the input format!)

unified can be used programmatically in Bun, Deno, or Node.js.
With a build step or through a CDN (such as [`esm.sh`][esm-sh]),
it can be used in browsers as well.
CLI versions, Grunt plugins, and Gulp plugins of processors also exist.

What makes unified unique is that it can switch between formats,
such as markdown to HTML,
in the same process.
This allows for even more powerful compositions.

The following plugins bridge formats:

* [`remark-rehype`][remark-rehype] — markdown to HTML
* [`rehype-remark`][rehype-remark] — HTML to markdown
* [`remark-retext`][remark-retext] — markdown to prose
* [`rehype-retext`][rehype-retext] — HTML to prose

### Use cases

Whenever you think about processing content — you can think of unified.
It’s a powerful tool.
So for some tasks,
such as transforming markdown to HTML,
you could use simpler tools like [`marked`][marked] as well.
Where unified really shines is when you want to go further than one single task.
For example, when you want to enforce format rules,
check spelling,
generate a table of contents,
and (potentially) much more:
that’s when to opt for unified.

> A large part of MDX’s success has been leveraging the unified and remark
> ecosystem.
> I was able to get a prototype working in a few hours because I didn’t have to
> worry about markdown parsing: remark gave it to me for free.
> It provided the primitives to build on.
>
> — [John Otander][john], author of [`mdx-js/mdx`][mdx]

To further speak to one’s imagination,
here are the more common plugins used in unified pipelines to do interesting
things:

* [`rehype-minify`][rehype-minify]
  — minify HTML
* [`rehype-react`][rehype-react]
  — transform to Preact, React, Vue, etc
* [`rehype-starry-night`][rehype-starry-night]
  — apply syntax highlighting to code
* [`remark-directive`][remark-directive]
  — support directives
* [`remark-gfm`][remark-gfm]
  — support GFM
* [`remark-lint`][remark-lint]
  — check markdown code style
* [`remark-toc`][remark-toc]
  — generate a table of contents
* [`retext-equality`][retext-equality]
  — check possibly insensitive language
* [`retext-repeated-words`][retext-repeated-words]
  — check `for for` repeated words
* [`retext-spell`][retext-spell]
  — check spelling
* …explore all [rehype][all-rehype-plugins],
  [remark][all-remark-plugins],
  or [retext][all-retext-plugins] plugins

### Summary

* unified is a friendly interface backed by an ecosystem of plugins built for
  creating and manipulating content;
  you don’t have to worry about parsing as you have the primitives to build
  on
* hundreds of plugins are available
* remark is used for markdown, rehype for HTML, and retext for natural
  language
* unified’s plugin pipeline lets you typically write one line of code to chain
  a feature into the process,
  such as bridging formats
  (such as markdown to HTML)

### Next steps

* [Use unified][using-unified]
* [Get started with plugins][using-plugins]
* [Intro to syntax trees][intro-to-syntax-trees]

<!--Definitions-->

[all-rehype-plugins]: https://github.com/topics/rehype-plugin

[all-remark-plugins]: https://github.com/topics/remark-plugin

[all-retext-plugins]: https://github.com/topics/retext-plugin

[esm-sh]: https://esm.sh

[john]: https://github.com/johno

[marked]: https://github.com/markedjs/marked

[mdx]: https://github.com/mdx-js/mdx

[rehype-minify]: https://github.com/rehypejs/rehype-minify

[rehype-react]: https://github.com/rehypejs/rehype-react

[rehype-remark]: https://github.com/rehypejs/rehype-remark

[rehype-retext]: https://github.com/rehypejs/rehype-retext

[rehype-starry-night]: https://github.com/rehypejs/rehype-starry-night

[remark-gfm]: https://github.com/remarkjs/remark-gfm

[remark-lint]: https://github.com/remarkjs/remark-lint

[remark-rehype]: https://github.com/remarkjs/remark-rehype

[remark-retext]: https://github.com/remarkjs/remark-retext

[retext-spell]: https://github.com/retextjs/retext-spell

[remark-toc]: https://github.com/remarkjs/remark-toc

[remark-directive]: https://github.com/remarkjs/remark-directive

[retext-equality]: https://github.com/retextjs/retext-equality

[retext-repeated-words]: https://github.com/retextjs/retext-repeated-words

[using-unified]: /learn/guide/using-unified/

[using-plugins]: /learn/guide/using-plugins/

[intro-to-syntax-trees]: /learn/guide/introduction-to-syntax-trees/
