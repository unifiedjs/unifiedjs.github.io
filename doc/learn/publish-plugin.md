---
authorGithub: wooorm
authorTwitter: wooorm
author: Titus Wormer
description: Guide that shows how to share a plugin with the world.
group: guide
modified: 2024-08-19
published: 2024-08-19
tags:
  - plugin
  - rehype
  - remark
  - retext
  - unified
  - publish
title: Publish a plugin
---

## Publish a plugin

This guide shows how to share a plugin with the world.

> Stuck?
> Have an idea for another guide?
> See [`support.md`][support].

### Contents

* [Intro](#intro)
* [Package name](#package-name)
* [npm](#npm)
* [GitHub](#github)
* [Export map](#export-map)
* [`export default`](#export-default)
* [Docs](#docs)
* [Tests](#tests)
* [License](#license)

### Intro

You may have a [plugin][github-unified-plugin] locally,
that you use in a project,
and think others might find useful too.

Below you’ll find some rules on how to share plugins with the world.

### Package name

The package name must be prefixed with `rehype-`, `remark-`, `retext-`, and so
on.
The name of the ecosystem.
Use this prefix **only** for plugins.
For presets, use `rehype-preset-`, `remark-preset-`, `retext-preset-`,
and so on.

### npm

Plugins should be published to npm.
You are free to publish them elsewhere too.

You should use a keyword `rehype-plugin`, `remark-plugin`, `retext-plugin`,
and so on,
to tag your package.

### GitHub

You may use GitHub.
Or an alternative.

Only GitHub is crawled for the [explore][] page.
You should use a topic `rehype-plugin`, `remark-plugin`, `retext-plugin`,
and so on,
to tag your repository.

### Export map

You must expose a plugin that can be imported from that package name.
So,
there must be a plugin at `rehype-some-plugin`.

There may be several plugins in a package.
One example is [`rehype-mathjax`][github-rehype-mathjax],
which has plugins exposed as `rehype-mathjax/browser`,
`rehype-mathjax/chtml`,
`rehype-mathjax/svg`,
and `rehype-mathjax` (as an alias for `rehype-mathjax/svg`).
The reason for different plugins in the same project is that they each use
different code.
Which impact performance and bundle size.

### `export default`

Your package must expose a plugin at the default export.
It must be a function that must work when passed as `x` to `unified().use(x)`.

There may be different exports too.
One example is [`remark-rehype`][github-remark-rehype],
which also exposes useful things at
`defaultFootnoteBackContent`,
`defaultFootnoteBackLabel`, and
`defaultHandlers`,
but the plugin itself is exported as `default`.

### Docs

Write a good readme.
Explain what the plugin does,
when it should be used or not,
how to configure it.

### Tests

Add thorough tests.
Use a CI.
You should test your project in all maintained versions of Node.js.

### License

Add a license.
It should be MIT or ISC,
as that aligns with most of the JavaScript ecosystem.
It must be an open source license.

[explore]: /explore/

[github-rehype-mathjax]: https://github.com/remarkjs/remark-math/tree/main/packages/rehype-mathjax

[github-remark-rehype]: https://github.com/remarkjs/remark-rehype

[github-unified-plugin]: https://github.com/unifiedjs/unified#plugin

[support]: https://github.com/unifiedjs/.github/blob/main/support.md
