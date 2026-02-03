---
authorGithub: wooorm
author: Titus Wormer
description: Guide that delves into transforming markdown to HTML
group: guide
index: 2
modified: 2024-08-02
published: 2017-05-03
tags:
  - rehype
  - remark
  - transform
  - use
title: Use unified
---

## Using unified

This guide shows how unified can be used to transform a markdown file to HTML.
It also shows how to generate a table of contents and sidesteps into checking
prose.

> Stuck?
> Have an idea for another guide?
> See [`support.md`][support].

### Contents

* [Tree transformations](#tree-transformations)
* [Plugins](#plugins)
* [Reporting](#reporting)
* [Checking prose](#checking-prose)
* [Further exercises](#further-exercises)

### Tree transformations

For this example we start out with markdown content and then turn it into HTML.
We need something to parse markdown and something to compile (stringify) HTML
for that.
The relevant projects are respectively [`remark-parse`][parse] and
[`rehype-stringify`][stringify].
To transform between the two syntaxes we use [`remark-rehype`][remark-rehype].
Finally, we use unified itself to glue these together.

First set up a project.
Create a folder `example`,
enter it,
and initialize a new package:

```sh
mkdir example
cd example
npm init -y
```

Then make sure the project is a module so that `import` and `export` work by
specifying `"type": "module"`:

```diff
--- a/package.json
+++ b/package.json
@@ -1,6 +1,7 @@
 {
   "name": "example",
   "version": "1.0.0",
+  "type": "module",
   "main": "index.js",
   "scripts": {
     "test": "echo \"Error: no test specified\" && exit 1"
```

Now let’s install the needed dependencies with [npm][], which comes bundled with
[Node.js][node].

```sh
npm install rehype-stringify remark-parse remark-rehype unified
```

Now create a markdown file, `example.md`, that we’re going to transform.

```md
# Pluto

Pluto is an dwarf planet in the Kuiper belt.

## Contents

## History

### Discovery

In the 1840s, Urbain Le Verrier used Newtonian mechanics to predict the
position of…

### Name and symbol

The name Pluto is for the Roman god of the underworld, from a Greek epithet for
Hades…

### Planet X disproved

Once Pluto was found, its faintness and lack of a viewable disc cast doubt…

## Orbit

Pluto’s orbital period is about 248 years…
```

Then create `index.js` as well.
It transforms markdown to HTML:

```js twoslash
/// <reference types="node" />
// ---cut---
import fs from 'node:fs/promises'
import rehypeStringify from 'rehype-stringify'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import {unified} from 'unified'

const document = await fs.readFile('example.md', 'utf8')

const file = await unified()
  .use(remarkParse)
  .use(remarkRehype)
  .use(rehypeStringify).process(document)

console.log(String(file))
```

Now, running our module with [Node][]:

```sh
node index.js
```

…gives us an `example.html` file that looks as follows:

```html
<h1>Pluto</h1>
<p>Pluto is an dwarf planet in the Kuiper belt.</p>
<h2>Contents</h2>
<h2>History</h2>
<h3>Discovery</h3>
<p>In the 1840s, Urbain Le Verrier used Newtonian mechanics to predict the
position of…</p>
<h3>Name and symbol</h3>
<p>The name Pluto is for the Roman god of the underworld, from a Greek epithet for
Hades…</p>
<h3>Planet X disproved</h3>
<p>Once Pluto was found, its faintness and lack of a viewable disc cast doubt…</p>
<h2>Orbit</h2>
<p>Pluto’s orbital period is about 248 years…</p>
```

> 👉
> Note that [`remark-rehype`][remark-rehype] doesn’t deal with HTML inside the
> markdown.
> See [*HTML and remark*][html-and-remark] for more info.

🎉
Nifty!
It doesn’t do much yet.
We’ll get there.
In the next section, we make this more useful by introducing plugins.

### Plugins

We’re still missing some things
Notably a table of contents and proper HTML document structure.

We can use [`rehype-slug`][slug] and [`remark-toc`][toc] for the former
and [`rehype-document`][document] for the latter task.

```sh
npm install rehype-document rehype-slug remark-toc
```

Let’s now use those two as well, by modifying our `index.js` file:

```diff
--- a/index.js
+++ b/index.js
@@ -1,14 +1,20 @@
 import fs from 'node:fs/promises'
+import rehypeDocument from 'rehype-document'
+import rehypeSlug from 'rehype-slug'
 import rehypeStringify from 'rehype-stringify'
 import remarkParse from 'remark-parse'
 import remarkRehype from 'remark-rehype'
+import remarkToc from 'remark-toc'
 import {unified} from 'unified'

 const document = await fs.readFile('example.md', 'utf8')

 const file = await unified()
   .use(remarkParse)
+  .use(remarkToc)
   .use(remarkRehype)
+  .use(rehypeSlug)
+  .use(rehypeDocument, {title: 'Pluto'})
   .use(rehypeStringify)
   .process(document)

```

We pass options to `rehype-document`.
In this case, we use that to make sure we get a proper `<title>` element in our
`<head>`, as required by the HTML specification.
More options are accepted by `rehype-document`, such as which language tag to
use.
These are described in detail in its [`readme.md`][document].
Many other plugins accept options as well, so make sure to read through their
docs to learn more.

> 👉
> Note that remark plugins work on a markdown tree.
> rehype plugins work on an HTML tree.
> It’s important that you place your `.use` calls in the correct places:
> plugins are order sensitive!

When running our module like before,
we’d get the following `example.html` file:

```html
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Pluto</title>
<meta content="width=device-width, initial-scale=1" name="viewport">
</head>
<body>
<h1 id="pluto">Pluto</h1>
<p>Pluto is an dwarf planet in the Kuiper belt.</p>
<h2 id="contents">Contents</h2>
<ul>
<li><a href="#history">History</a>
<ul>
<li><a href="#discovery">Discovery</a></li>
<li><a href="#name-and-symbol">Name and symbol</a></li>
<li><a href="#planet-x-disproved">Planet X disproved</a></li>
</ul>
</li>
<li><a href="#orbit">Orbit</a></li>
</ul>
<h2 id="history">History</h2>
<h3 id="discovery">Discovery</h3>
<p>In the 1840s, Urbain Le Verrier used Newtonian mechanics to predict the
position of…</p>
<h3 id="name-and-symbol">Name and symbol</h3>
<p>The name Pluto is for the Roman god of the underworld, from a Greek epithet for
Hades…</p>
<h3 id="planet-x-disproved">Planet X disproved</h3>
<p>Once Pluto was found, its faintness and lack of a viewable disc cast doubt…</p>
<h2 id="orbit">Orbit</h2>
<p>Pluto’s orbital period is about 248 years…</p>
</body>
</html>
```

> 👉
> Note that the document isn’t formatted nicely.
> There’s a plugin for that though!
> Feel free to add [`rehype-format`][rehype-format] to the plugins.
> Right after `rehypeDocument`!

💯
You’re acing it!
This is getting pretty useful, right?

In the next section,
we lay the groundwork for creating a report.

### Reporting

Before we check some prose, let’s first switch up our `index.js` file to print
a pretty report.

We can use [`to-vfile`][to-vfile] to read and write virtual files from the file
system.
Then we can use [`vfile-reporter`][reporter] to report messages relating to
those files.
Let’s install those.

```sh
npm install to-vfile vfile-reporter
```

…and then use vfile in our example instead, like so:

```diff
--- a/index.js
+++ b/index.js
@@ -1,21 +1,24 @@
-import fs from 'node:fs/promises'
 import rehypeDocument from 'rehype-document'
 import rehypeSlug from 'rehype-slug'
 import rehypeStringify from 'rehype-stringify'
 import remarkParse from 'remark-parse'
 import remarkRehype from 'remark-rehype'
 import remarkToc from 'remark-toc'
+import {read, write} from 'to-vfile'
 import {unified} from 'unified'
+import {reporter} from 'vfile-reporter'

-const document = await fs.readFile('example.md', 'utf8')
+const file = await read('example.md')

-const file = await unified()
+await unified()
   .use(remarkParse)
   .use(remarkToc)
   .use(remarkRehype)
   .use(rehypeSlug)
   .use(rehypeDocument, {title: 'Pluto'})
   .use(rehypeStringify)
-  .process(document)
+  .process(file)

-console.log(String(file))
+console.error(reporter(file))
+file.extname = '.html'
+await write(file)
```

If we now run our module on its own we get a report showing everything’s fine:

```sh
$ node index.js
example.md: no issues found
```

But everything’s not fine: there’s a typo in the markdown!
The next section shows how to detect prose errors by adding retext.

### Checking prose

I did notice a typo in there.
So let’s check some prose to prevent that from happening in the future.
We can use retext and its ecosystem for our natural language parsing.
As we’re writing in English,
we use [`retext-english`][english] specifically to parse English natural
language.
The problem in our `example.md` file is that it has `an dwarf planet` instead
of `a dwarf planet`,
which is conveniently checked for by
[`retext-indefinite-article`][indefinite-article].
To bridge from markup to prose we use [`remark-retext`][remark-retext].
Let’s install these dependencies as well.

```sh
npm install remark-retext retext-english retext-indefinite-article
```

…and change our `index.js` like so:

```diff
--- a/index.js
+++ b/index.js
@@ -3,7 +3,10 @@ import rehypeSlug from 'rehype-slug'
 import rehypeStringify from 'rehype-stringify'
 import remarkParse from 'remark-parse'
 import remarkRehype from 'remark-rehype'
+import remarkRetext from 'remark-retext'
 import remarkToc from 'remark-toc'
+import retextEnglish from 'retext-english'
+import retextIndefiniteArticle from 'retext-indefinite-article'
 import {read, write} from 'to-vfile'
 import {unified} from 'unified'
 import {reporter} from 'vfile-reporter'
@@ -12,6 +15,8 @@ const file = await read('example.md')

 await unified()
   .use(remarkParse)
+  // @ts-expect-error: fine.
+  .use(remarkRetext, unified().use(retextEnglish).use(retextIndefiniteArticle))
   .use(remarkToc)
   .use(remarkRehype)
   .use(rehypeSlug)
```

As the code shows,
`remark-retext` receives another `unified` pipeline.
A natural language pipeline.
The plugin will transform the origin syntax (markdown) with the parser defined
on the given pipeline.
Then it runs the attached plugins on the natural language syntax tree.

Now when running our module one final time:

```sh
$ node index.js
example.md
3:10-3:12 warning Unexpected article `an` before `dwarf`, expected `a` retext-indefinite-article retext-indefinite-article

⚠ 1 warning
```

…we get a useful message.

💃
You’ve got a really cool system set up already.
Nicely done!
That’s a wrap though, check out the next section for further exercises and
resources.

### Further exercises

Finally,
check out the lists of available plugins for [retext][retext-plugins],
[remark][remark-plugins],
and [rehype][rehype-plugins],
and try some of them out.

If you haven’t already, check out the other articles in the
[learn section][learn]!

<!--Definitions-->

[document]: https://github.com/rehypejs/rehype-document

[english]: https://github.com/retextjs/retext/tree/HEAD/packages/retext-english

[html-and-remark]: /learn/recipe/remark-html/

[indefinite-article]: https://github.com/retextjs/retext-indefinite-article

[learn]: /learn/

[node]: https://nodejs.org/en

[npm]: https://www.npmjs.com

[parse]: https://github.com/remarkjs/remark/tree/HEAD/packages/remark-parse

[rehype-format]: https://github.com/rehypejs/rehype-format

[rehype-plugins]: https://github.com/rehypejs/rehype/blob/HEAD/doc/plugins.md

[remark-plugins]: https://github.com/remarkjs/remark/blob/HEAD/doc/plugins.md

[remark-rehype]: https://github.com/remarkjs/remark-rehype

[remark-retext]: https://github.com/remarkjs/remark-retext

[reporter]: https://github.com/vfile/vfile-reporter

[retext-plugins]: https://github.com/retextjs/retext/blob/HEAD/doc/plugins.md

[slug]: https://github.com/rehypejs/rehype-slug

[stringify]: https://github.com/rehypejs/rehype/tree/HEAD/packages/rehype-stringify

[support]: https://github.com/unifiedjs/.github/blob/main/support.md

[to-vfile]: https://github.com/vfile/to-vfile

[toc]: https://github.com/remarkjs/remark-toc
