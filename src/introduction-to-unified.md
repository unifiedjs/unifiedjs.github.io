## Introduction to unified

* * *

After reading this guide you will:

*   Understand what unified does.
*   Get a taste of the ecosystem.
*   Know how it can be used.
*   Know what parts (processors) you need for your (future) use case.
*   Have a list of resources to continue learning or get started.

* * *

![Example of using unified](./image/unified-overview.png)

**unified is a friendly interface backed by an ecosystem of plugins built for
creating and manipulating content**. unified does this by taking markdown, HTML,
or plain text prose, turning it into structured data, and making it available
to over 100 plugins.  Tasks like text analysis, preprocessing, spellchecking,
linting, and more can all be done through compatible tools, and even chained
together.

This and more is possible thanks to unified’s plugin pipeline, which lets you
typically write one line of code to chain a feature into this process.
It’s also possible to stitch together content from different sources
and output it as a single source.

**Bottom line: with unified, you don’t manually handle syntax or parsing.**

However, the heavy lifting isn’t being done by unified itself, it’s a rather
small module that acts as an interface to unify the handling of different
content formats.  What makes unified powerful are the plugins that can be 
chained to the handler of a content format.  A module that handles a certain
content format, for instance [remark][remark] for markdown,
is called a **processor**.

unified has a family of processors, tooling, and specifications.  It’s called
the unified collective.

### unified collective

The unified collective are like-minded organisations to collaboratively work
on the innovation of content through seamless, interchangeable,
and extendible tooling.

Depending on what you want to do you will reference different organisations.
But before getting into the examples, let’s do an introduction round!

#### Processors

*   [remark][remark] — markdown.
*   [rehype][rehype] — HTML.
*   [retext][retext] — natural language.
*   [redot][redot] — Graphviz.

There is also a new markdown parser in the works, [micromark][micromark]!

#### Tools

*   [mdx][mdx] — JSX in Markdown.
*   [vfile][vfile] — Virtual file format for text processing.

#### Specifications

*   [unist][unist] — Universal Syntax Tree.
*   [mdast][mdast] — Markdown Abstract Syntax Tree format.
*   [hast][hast] — HTML Abstract Syntax Tree format.
*   [nlcst][nlcst] — Natural Language Concrete Syntax Tree format.

* * *

Don’t worry, we’ll get to how all of this comes together in unified.
But if you are already feeling adventurous; you can go directly to
[“Using unified”](<>) or [“How to get started with plugins”](<>).

* * *

### How does it all come together

unified can integrate with the file-system through
[unified-engine][unified-engine].  On top of that, CLI apps can be created with
[unified-args][unified-args], Gulp plugins with
[unified-engine-gulp][unified-engine-gulp], and Atom Linters with
[unified-engine-atom][unified-engine-atom].

But how do these specifications, tools, and processors fit together?
**Essentially, unified is a three part act**:

1.  **Parse.**  Whether your input is natural text, HTML, or markdown
    — it needs to be parsed to a universal workable format.
    The processors (e.g [remark][remark]) are responsible for doing just that.
    The specifications (e.g [mdast][mdast] for remark) make sure these formats
    are enforced standards.
2.  **Transform.**  This is where the magic happens.  Plugins are able to easily
    hook into this phase and add, change, or remove anything that it’s given.
    Thanks to unified’s pipeline, you can compose plugins and define the order
    they run in.
3.  **Stringify.**  When all plugins have ran, the final step is to take the
    (adjusted) representation and transform it back to its original format
    (or to a different format!).

#### Bridging formats

What makes unified unique is that it can continuously switch between formats,
markdown to HTML for instance, in the same process.
This allows for even more powerful compositions.

Bridging formats can be done with the following plugins:

*   [remark-rehype][remark-rehype] — markdown to HTML.
*   [rehype-remark][rehype-remark] — HTML to markdown.

### Use cases

**Whenever you think about processing content — you can think of unified**.
Unified makes it easier for developers to develop by providing the means to
quickly iterate, manipulate, and create content.

> A large part of MDX’s success has been leveraging the unified and remark
> ecosystem.  I was able to get a prototype working in a few hours because
> I didn’t have to worry about markdown parsing: remark gave it to me for free.
> It provided the primitives to build on.
>
> — [John Otander][john], author of [mdx-js/mdx][mdx]

To further speak to one’s imagination, here are the more common plugins used in
the unified pipeline to do interesting things:

*   [remark-toc][remark-toc]  —  generate a table of contents.
*   [rehype-prism][rehype-prism] —  highlight code in HTML with Prism.
*   [retext-spell][retext-spell]  —  check spelling.
*   [remark-lint][remark-lint] —  check markdown code style.
*   [retext-equality][retext-equality] — check possibly insensitive language.
*   [remark-math][remark-math] support math in markdown / HTML.
*   [retext-repeated-words][retext-repeated-words]
    —  check for for repeated words.
*   [rehype-minify][rehype-minify]  —  minify HTML.
*   …explore all [remark][all-remark-plugins], [rehype][all-rehype-plugins],
    or [retext][all-retext-plugins] plugins.

### Summary

*   unified is a friendly interface backed by an ecosystem of plugins built for
    creating and manipulating content.
*   There are hundreds of plugins available.
*   unified’s plugin pipeline lets you typically write one line of code to chain
    a feature into the process.
*   Bridging formats (e.g markdown -> HTML) can be done in a single line of
    code as well.
*   unified can integrate the file-system, the CLI, Gulp, or Atom Linters.

### Next steps

*   [Using unified](<>).
*   [How to get started with plugins](<>).
*   [Introduction to syntax trees with `unist`, `mdast`, `hast`, and `nlcst`](<>).

[remark]: https://github.com/remarkjs/remark

[rehype]: https://github.com/rehypejs/rehype

[retext]: https://github.com/retextjs/retext

[redot]: https://github.com/redotjs/redot

[micromark]: https://github.com/micromark/micromark

[mdx]: https://github.com/mdx-js/mdx

[vfile]: https://github.com/vfile/vfile/

[unist]: https://github.com/syntax-tree/unist

[mdast]: https://github.com/syntax-tree/mdast

[hast]: https://github.com/syntax-tree/hast

[nlcst]: https://github.com/syntax-tree/nlcst

[john]: https://github.com/johno/

[remark-rehype]: https://github.com/remarkjs/remark-rehype/

[rehype-remark]: https://github.com/rehypejs/rehype-remark

[unified-engine]: https://github.com/unifiedjs/unified-engine

[unified-args]: https://github.com/unifiedjs/unified-args

[unified-engine-gulp]: https://github.com/unifiedjs/unified-engine-gulp

[unified-engine-atom]: https://github.com/unifiedjs/unified-engine-atom

[remark-toc]: https://github.com/remarkjs/remark-toc

[rehype-prism]: https://github.com/mapbox/rehype-prism

[retext-spell]: https://github.com/retextjs/retext-spell

[remark-lint]: https://github.com/remarkjs/remark-lint

[retext-equality]: https://github.com/retextjs/retext-equality

[remark-math]: https://github.com/Rokt33r/remark-math

[retext-repeated-words]: https://github.com/retextjs/retext-repeated-words

[rehype-minify]: https://github.com/rehypejs/rehype-minify

[all-remark-plugins]: https://github.com/topics/remark-plugin

[all-rehype-plugins]: https://github.com/topics/rehype-plugin

[all-retext-plugins]: https://github.com/topics/retext-plugin
