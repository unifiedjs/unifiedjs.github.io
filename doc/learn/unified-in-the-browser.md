---
authorGithub: wooorm
authorTwitter: wooorm
author: Titus Wormer
description: How to use unified in the browser
group: guide
modified: 2024-08-09
published: 2024-08-09
tags:
  - browser
  - dom
  - esbuild
  - hast
  - mdast
  - nlcst
  - rehype
  - remark
  - retext
  - unified
  - web
title: unified in the browser
---

## unified in the browser

unified is many different projects that are maintained on GitHub
and distributed mainly through npm.
Almost all the projects can be used anywhere: in Bun, Deno, Node.js,
on the edge, or in browsers.
To use our projects in a browser,
you need to do one or two things.
And there’s different ways to go about it.

### Contents

* [Bundle](#bundle)
* [CDN](#cdn)

### Bundle

A common way to use unified in the browser is to bundle it with a bundler.
You perhaps know bundlers already: webpack, Rollup, or esbuild.
You might be using one.
Or otherwise have a favorite.
If not,
[esbuild][] is a good choice.

Bundling is almost always a good idea.
It gives end users a single file to download.
Often minified.

Say we have some code using unified in `example.js`:

```js twoslash
/// <reference lib="dom" />
// ---cut---
import rehypeStringify from 'rehype-stringify'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import {unified} from 'unified'

const file = await unified()
  .use(remarkParse)
  .use(remarkRehype)
  .use(rehypeStringify)
  .process('Hello, *world*!')

console.log(String(file))
```

And you want to use that in some HTML called `index.html`:

```html
<!doctype html>
<meta charset=utf8>
<title>Example</title>
<script src=example.min.js type=module></script>
```

To make `example.js` work in the browser,
you can bundle it with esbuild.
First,
set up a package.
Go to the folder in your terminal and run:

```sh
npm init --yes
npm install esbuild --save-dev rehype-stringify remark-parse remark-rehype unified
```

Then, bundle `example.js`:

```sh
npx esbuild --bundle --format=esm --minify --outfile=example.min.js example.js
```

Now, open `index.html` in a browser.
When you open the console of your developer tools,
you should see `Hello, <em>world</em>!`

You probably also want to configure the target environment for the browsers
that you support.
That way,
JavaScript syntax which is too new for some browsers,
will be transformed into older JavaScript syntax that works.
Pass the [`--target`][esbuild-target] flag to do this.

### CDN

If you don’t want to bundle unified yourself,
you can use a CDN.

A CDN hosts files for you.
And they can process them for you as well.
The nice thing is that you do not have to install and bundle things yourself.
The downside is that you’re dependent on a particular server that you do not
control.

One such CDN is [esm.sh][esmsh].
Like the code above,
you can use it in a browser like this:

```html
<!doctype html>
<meta charset=utf8>
<title>Example</title>
<script type=module>
  import rehypeStringify from 'https://esm.sh/rehype-stringify@10?bundle'
  import remarkParse from 'https://esm.sh/remark-parse@11?bundle'
  import remarkRehype from 'https://esm.sh/remark-rehype@11?bundle'
  import {unified} from 'https://esm.sh/unified@11?bundle'

  const file = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeStringify)
    .process('Hello, *world*!')

  console.log(String(file))
</script>
```

[esbuild]: https://esbuild.github.io/

[esbuild-target]: https://esbuild.github.io/api/#target

[esmsh]: https://esm.sh/
