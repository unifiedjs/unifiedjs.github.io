# about unified

> Building a bridge between formats

unified is an ecosystem for dealing with many sources of content.
It enables [Gatsby][] to pull in markdown as data to make blazing fast sites.
It’s what generates the HTML for [Node][]’s API docs.
It’s what allows [Prettier][] to format markdown.
It’s what lets you write JSX inside markdown when you’re creating a
presentation with [mdx-deck][].

Those are just four exciting use cases of what unified can do, but it can do
much more.
There’s 250+ projects that deal with the syntax of markdown, HTML, and prose,
that can be stitched together to do all kinds of interesting and useful things.

### Mission

We believe content is incredibly important for the future of modern websites,
applications, tools, and programming in general.
We build numerous parsers, transformers, and utilities so that you don’t have
to worry about syntax.

### How unified works

unified works with documents through syntax trees.
Syntax trees are a way for computers to understand syntax.
When programs understands syntax, they can inspect it for problems, and warn
about them, as it’s known where the syntax was in the original document.
Programs can also transform  syntax to something else, add new things, or
remove things.
Syntax trees come in two flavours: Concrete (CST) and Abstract (AST).
The first has all information needed to restore the original document
completely, the latter does not.
But, ASTs can recreate an exact syntactic representation.
For example, CSTs house info on style such as tabs or spaces, but ASTs do not.
This makes ASTs often easier to work with.

*   **parse**
    — first, take a document, and we parse it into a syntax tree
*   **transform**
    — second, take the syntax tree run it through a set of plugins
*   **stringify**
    — third, take the syntax tree and compile it back to a document

The transform phase could be one small thing, like generating the table of
contents, or a more advanced process that transforms markdown to HTML.
Whatever happens is abstracted away though, as a user you’ll typically
write one line of code to chain a plugin into this process

## Open Source

For the last 5 years, we’ve built these projects in our evenings and weekends,
next to our day job.
We want to grow these open source projects, bring new people on board, and to
be sustainable, but we need your support to do so.

Join [Gatsby][], [Zeit][], and [Compositor][] in sponsoring unified on
[Open Collective][oc].

<!-- TODO: add logos -->

*   Gatsby logo (big)
*   Zeit logo (big)
*   Compositor logo (big)

## Projects

We are a collective of developers building projects that are downloaded millions
of times each month.
We create low-level software that tackles syntax (such as [micromark][]) and
high-level software to abstract it away (such as [mdx][]).

<!-- TODO: add link -->

View projects »

## Users

<!-- TODO: grid of logos, smaller than sponsors, but still legible -->

*   freeCodeCamp
*   Gatsby
*   prettier
*   Node.js
*   Google
*   Mozilla
*   GitHub
*   Storybook
*   rxjs
*   Netlify
*   ESLint
*   mdx

<!-- Definitions -->

[oc]: https://opencollective.com/unified

[micromark]: https://github.com/micromark/micromark

[mdx]: https://github.com/mdx-js/mdx

[node]: https://nodejs.org/en/

[prettier]: https://prettier.io

[mdx-deck]: https://github.com/jxnblk/mdx-deck

[gatsby]: https://www.gatsbyjs.org

[zeit]: https://zeit.co

[compositor]: https://compositor.io
