---
group: guide
index: 1
title: Intro to unified
description: Guide that summarises the what and why of unified
author: Merlijn Vos
authorTwitter: Murderlon
authorGithub: Murderlon
tags:
  - welcome
  - introduction
published: 2019-12-12
modified: 2020-06-14
---

## Introduction to unified

After reading this guide you will:

* Understand what unified does
* Get a taste of the ecosystem
* Know how it can be used
* Know what parts (processors) you need for your (future) use case
* Have a list of resources to continue learning or get started

![][unified-overview]

### Contents

* [Intro](#intro)
* [Collective](#collective)
* [How it comes together](#how-it-comes-together)
* [Use cases](#use-cases)
* [Summary](#summary)
* [Next steps](#next-steps)

### Intro

**unified is a friendly interface backed by an ecosystem of plugins built for
creating and manipulating content**.
It does this by taking Markdown, HTML, or plain text prose, turning it into
structured data, and making it available to over 100 plugins.
Plugins for example do tasks such as spellchecking, linting, or minifying.

With unified, you don’t manually handle syntax or parsing.
Instead you typically write one line of code to chain a plugin into unified’s
process.

unified itself is a rather small module that acts as an interface to unify the
handling of different content formats.
Around a certain format, there sits an ecosystem, such as remark for Markdown.
Several ecosystems exist for unified.
Together with other tools and specifications, they form the unified collective.

### Collective

The unified collective spans like-minded organizations.
These organizations have the shared goal to innovate content processing.
Seamless, interchangeable, and pluggable tooling is how that’s achieved.

Depending on what you want to do, you will reference different organizations.
So let’s start off with an introduction round.

The ecosystems:

* remark — Markdown
* rehype — HTML
* retext — Natural language
* redot — Graphviz

The specifications for syntax trees:

* unist — Universal Syntax Tree
* mdast — Markdown Abstract Syntax Tree format
* hast — HTML Abstract Syntax Tree format
* xast — XML Abstract Syntax Tree format
* esast — ECMAScript Abstract Syntax Tree format
* nlcst — Natural Language Concrete Syntax Tree format

Other building blocks:

* syntax-tree — Low-level utilities for building plugins
* vfile — Virtual file format for text processing
* MDX — Markdown and JSX

We’ll get to how these come together in the next section.
If you are already feeling adventurous, you can go directly to
“[Using unified][using-unified]” or
“[How to get started with plugins][using-plugins]”.

### How it comes together

These processors, specifications, and tools come together in a three part act.
The process of a processor:

1. **Parse**:
   Whether your input is Markdown, HTML, or prose — it needs to be parsed to a
   workable format.
   Such a format is called a syntax tree.
   The specifications (for example mdast) define how such a syntax tree looks.
   The processors (such as remark for mdast) are responsible for creating them.
2. **Transform**:
   This is where the magic happens.
   Users compose plugins and the order they run in.
   Plugins plug into this phase and transform and inspect the format they get.
3. **Stringify**:
   The final step is to take the (adjusted) format and stringify it to
   Markdown, HTML, or prose (which could be different from the input format!)

unified can be used programmatically in Node.js.
With a build step, it can be used in browsers as well.
CLI versions, Grunt plugins, and Gulp plugins of processors also exist.

What makes unified unique is that it can switch between formats, such as
Markdown to HTML, in the same process.
This allows for even more powerful compositions.

The following plugins bridge formats:

* [`remark-rehype`][remark-rehype] — Markdown to HTML
* [`rehype-remark`][rehype-remark] — HTML to Markdown
* [`remark-retext`][remark-retext] — Markdown to prose
* [`rehype-retext`][rehype-retext] — HTML to prose

### Use cases

**Whenever you think about processing content — you can think of unified**.
It’s a powerful tool, so for some tasks, such as transforming Markdown to HTML,
you could use simpler tools like [`marked`][marked] as well.
Where unified really shines is when you want to go further than one single task.
For example, when you want to enforce format rules, check spelling, generate a
table of contents, and (potentially) much more: that’s when to opt for unified.

> A large part of MDX’s success has been leveraging the unified and remark
> ecosystem.
> I was able to get a prototype working in a few hours because I didn’t have to
> worry about Markdown parsing: remark gave it to me for free.
> It provided the primitives to build on.
>
> — [John Otander][john], author of [`mdx-js/mdx`][mdx]

To further speak to one’s imagination, here are the more common plugins used in
unified pipelines to do interesting things:

* [`remark-toc`][remark-toc] — Generate a table of contents
* [`rehype-prism`][rehype-prism] — Highlight code in HTML with Prism
* [`retext-spell`][retext-spell] — Check spelling
* [`remark-lint`][remark-lint] — Check Markdown code style
* [`retext-equality`][retext-equality] — Check possibly insensitive language
* [`remark-math`][remark-math] — Support math in Markdown / HTML
* [`retext-repeated-words`][retext-repeated-words]
  — Check `for for` repeated words
* [`rehype-minify`][rehype-minify] — Minify HTML
* …explore all [remark][all-remark-plugins], [rehype][all-rehype-plugins]
  or [retext][all-retext-plugins] plugins

### Summary

* unified is a friendly interface backed by an ecosystem of plugins built for
  creating and manipulating content.
  You don’t have to worry about parsing as you have the primitives to build
  on
* Hundreds of plugins are available
* remark is used for Markdown, rehype for HTML, and retext for natural
  language
* unified’s plugin pipeline lets you typically write one line of code to chain
  a feature into the process, such as bridging formats
  (such as Markdown to HTML)

### Next steps

* [Use unified][using-unified]
* [Get started with plugins][using-plugins]
* [Intro to syntax trees][intro-to-syntax-trees]

<!--Definitions-->

[mdx]: https://github.com/mdx-js/mdx

[john]: https://github.com/johno/

[remark-rehype]: https://github.com/remarkjs/remark-rehype/

[rehype-remark]: https://github.com/rehypejs/rehype-remark

[remark-retext]: https://github.com/remarkjs/remark-retext/

[rehype-retext]: https://github.com/rehypejs/rehype-retext

[remark-toc]: https://github.com/remarkjs/remark-toc

[rehype-prism]: https://github.com/mapbox/rehype-prism

[retext-spell]: https://github.com/retextjs/retext-spell

[remark-lint]: https://github.com/remarkjs/remark-lint

[retext-equality]: https://github.com/retextjs/retext-equality

[remark-math]: https://github.com/remarkjs/remark-math

[retext-repeated-words]: https://github.com/retextjs/retext-repeated-words

[rehype-minify]: https://github.com/rehypejs/rehype-minify

[all-remark-plugins]: https://github.com/topics/remark-plugin

[all-rehype-plugins]: https://github.com/topics/rehype-plugin

[all-retext-plugins]: https://github.com/topics/retext-plugin

[marked]: https://github.com/markedjs/marked

[unified-overview]: /image/unified-overview.png

[using-unified]: /learn/guide/using-unified/

[using-plugins]: /learn/guide/using-plugins/

[intro-to-syntax-trees]: /learn/guide/introduction-to-syntax-trees/
