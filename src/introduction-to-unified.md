## Introduction to unified

* * *

After reading this guide you will:

*   Understand what unified does.
*   Get a taste of the ecosystem.
*   Know how it can be used.
*   Know what parts (processors) you need for your (future) use case.
*   Have a list of resources to continue learning or get started.

* * *

![](./image/unified-overview.png)

**unified is a friendly interface backed by an ecosystem of plugins built for
creating and manipulating content**.  unified does this by taking Markdown,
HTML, or plain text prose, turning it into structured data, and making it
available to over 100 plugins.  Tasks like text analysis, preprocessing,
spellchecking, linting, and more can all be done through compatible plugins,
and even chained together.

This and more is possible thanks to unified’s plugin pipeline, which lets you
typically write one line of code to chain a plugin into this process.

**Bottom line: with unified, you don’t manually handle syntax or parsing.**

The heavy lifting isn’t being done by unified itself, it’s a rather
small module that acts as an interface to unify the handling of different
content formats, such as Markdown, HTML, or prose.  A module that handles a
certain content format, for instance [remark][remark] for Markdown,
is called a **processor**.

unified has a family of processors, tooling, and specifications.  It’s called
the unified collective.

### unified collective

The unified collective are like-minded organisations to collaboratively work
on the innovation of content through seamless, interchangeable,
and pluggable tooling.

Depending on what you want to do you will reference different organisations.
But before getting into the examples, let’s do an introduction round!

#### Processors

*   [remark][remark] — Markdown.
*   [rehype][rehype] — HTML.
*   [retext][retext] — natural language.
*   [redot][redot] — Graphviz.

#### Building blocks

*   [syntax-tree][syntax-tree] — Low-level utilities for building plugins.
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

unified can be used programmatically in Node, it can also run
in the browser but that does require a build step.  Furthermore, the processors
also have an CLI alternative and often a Gulp version.

But how do these specifications, tools, and processors fit together?
**Essentially, unified is a three part act**:

1.  **Parse**:  Whether your input is natural text, HTML, or Markdown
    — it needs to be parsed to a universal workable format.
    The processors (such as [remark][remark]) are responsible for doing that.
    The specifications (for example [mdast][mdast] for remark) make sure these
    formats are enforced standards.
2.  **Transform**:  This is where the magic happens.  Plugins are able to
    hook into this phase and transform and inspect anything that it’s given.
    Thanks to unified’s pipeline, you can compose plugins and define the order
    they run in.
3.  **Stringify**:  When all plugins are done, the final step is to take the
    (adjusted) representation and transform it back to its original format
    (or to a different format!)

#### Bridging formats

What makes unified unique is that it can continuously switch between formats,
Markdown to HTML for instance, in the same process.
This allows for even more powerful compositions.

Bridging formats can be done with the following plugins:

*   [remark-rehype][remark-rehype] — Markdown to HTML.
*   [rehype-remark][rehype-remark] — HTML to Markdown.
*   [remark-retext][remark-retext] — Markdown to prose.
*   [rehype-retext][rehype-retext] — HTML to prose.

### Use cases

**Whenever you think about processing content — you can think of unified**.
But it can also be more than you need, if you only want to transform Markdown
to HTML; you can use [remark][remark] directly (or similar projects like
[marked][marked]).  unified becomes truly useful when you want to go further
than only transforming.  When you want tasks like enforcing format rules,
spell checking, dynamic generation of content (such as a table of contents),
and (potentially) much more — that’s when to opt for unified.

> A large part of MDX’s success has been leveraging the unified and remark
> ecosystem.  I was able to get a prototype working in a few hours because
> I didn’t have to worry about markdown parsing: remark gave it to me for free.
> It provided the primitives to build on.
>
> — [John Otander][john], author of [mdx-js/mdx][mdx]

To further speak to one’s imagination, here are the more common plugins used in
the unified pipeline to do interesting things:

*   [remark-toc][remark-toc] — generate a table of contents.
*   [rehype-prism][rehype-prism] — highlight code in HTML with Prism.
*   [retext-spell][retext-spell] — check spelling.
*   [remark-lint][remark-lint] — check markdown code style.
*   [retext-equality][retext-equality] — check possibly insensitive language.
*   [remark-math][remark-math] — support math in markdown / HTML.
*   [retext-repeated-words][retext-repeated-words]
    — check for for repeated words.
*   [rehype-minify][rehype-minify] — minify HTML.
*   …explore all [remark][all-remark-plugins], [rehype][all-rehype-plugins],
    or [retext][all-retext-plugins] plugins.

### Summary

*   unified is a friendly interface backed by an ecosystem of plugins built for
    creating and manipulating content.  You don’t have to worry about parsing
    as you have the primitives to build on.
*   There are hundreds of plugins available.
*   [remark][remark] is used for markdown, [rehype][rehype] for HTML, and
    [retext][retext] for natural language.
*   unified’s plugin pipeline lets you typically write one line of code to chain
    a feature into the process.  Bridging formats (such as markdown to HTML)
    can be done in a single line of code as well.

### Next steps

*   [Using unified](<>).
*   [How to get started with plugins](<>).
*   [Introduction to syntax trees with `unist`, `mdast`, `hast`, and `nlcst`](<>).

[remark]: https://github.com/remarkjs/remark

[rehype]: https://github.com/rehypejs/rehype

[retext]: https://github.com/retextjs/retext

[redot]: https://github.com/redotjs/redot

[mdx]: https://github.com/mdx-js/mdx

[vfile]: https://github.com/vfile/vfile/

[unist]: https://github.com/syntax-tree/unist

[mdast]: https://github.com/syntax-tree/mdast

[hast]: https://github.com/syntax-tree/hast

[nlcst]: https://github.com/syntax-tree/nlcst

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

[remark-math]: https://github.com/Rokt33r/remark-math

[retext-repeated-words]: https://github.com/retextjs/retext-repeated-words

[rehype-minify]: https://github.com/rehypejs/rehype-minify

[all-remark-plugins]: https://github.com/topics/remark-plugin

[all-rehype-plugins]: https://github.com/topics/rehype-plugin

[all-retext-plugins]: https://github.com/topics/retext-plugin

[syntax-tree]: https://github.com/syntax-tree

[marked]: https://github.com/markedjs/marked
