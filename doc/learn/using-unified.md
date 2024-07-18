---
group: guide
index: 2
title: Use unified
description: Guide that delves into transforming Markdown to HTML
author: Titus Wormer
authorTwitter: wooorm
authorGithub: wooorm
tags:
  - use
  - transform
  - remark
  - rehype
published: 2017-05-03
modified: 2020-06-14
---

## Using unified

This guide delves into how unified can be used to transform a Markdown file to
HTML.
It’ll also show how to generate a table of contents, and sidestep into checking
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

For this example, we’ll start out with Markdown content, then transform to HTML.
We need a Markdown parser and an HTML stringifier for that.
The relevant projects are respectively [`remark-parse`][parse] and
[`rehype-stringify`][stringify].
To transform between the two syntaxes, we’ll use
[`remark-rehype`][remark-rehype].
Finally, we’ll use unified itself to glue these together, and
[`unified-stream`][unified-stream] for streaming.

First set up a project.
Create a folder, `example`, enter it, and initialize a new project:

```sh
mkdir example
cd example
npm init -y
```

Then make sure the project is a module, so that `import` and `export` work,
by changing `package.json`:

```diff
--- a/package.json
+++ b/package.json
@@ -2,6 +2,7 @@
   "name": "example",
   "version": "1.0.0",
   "description": "",
+  "type": "module",
   "main": "index.js",
   "scripts": {
     "test": "echo \"Error: no test specified\" && exit 1"
```

Now let’s install the needed dependencies with [npm][], which comes bundled with
[Node][].

```sh
npm install unified unified-stream remark-parse remark-rehype rehype-stringify
```

Now create a Markdown file, `example.md`, that we’re going to transform.

```markdown
# Hello World

## Table of Content

## Install

A **example**.

## Use

More `text`.

## License

MIT
```

Then create `index.js` as well.
It’ll transform Markdown to HTML.
It’s hooked up to read from stdin and write to stdout.

```javascript
import {stream} from 'unified-stream'
import {unified} from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'

const processor = unified()
  .use(remarkParse)
  .use(remarkRehype)
  .use(rehypeStringify)

process.stdin.pipe(stream(processor)).pipe(process.stdout)
```

Now, running our script with [Node][] (this uses your Shell to read
`example.md` and write `example.html`):

```sh
node index.js < example.md > example.html
```

…gives us an `example.html` file that looks as follows:

```html
<h1>Hello World</h1>
<h2>Table of Content</h2>
<h2>Install</h2>
<p>A <strong>example</strong>.</p>
<h2>Use</h2>
<p>More <code>text</code>.</p>
<h2>License</h2>
<p>MIT</p>
```

> Note that [`remark-rehype`][remark-rehype] doesn’t deal with HTML inside the
> Markdown.
> You’ll need [`rehype-raw`][rehype-raw] if you’re planning on doing that.

🎉
Nifty!
It doesn’t do much yet, but we’ll get there.
In the next section, we’ll make this more useful by introducing plugins.

### Plugins

We’re still missing some things, notably a table of contents, and proper HTML
document structure.

We can use [`remark-slug`][slug] and [`remark-toc`][toc] for the former, and
[`rehype-document`][document] to do the latter tasks.

```sh
npm install remark-slug remark-toc rehype-document
```

Let’s now use those two as well, by modifying our `index.js` file:

```diff
--- a/index.js
+++ b/index.js
@@ -1,12 +1,18 @@
 import {stream} from 'unified-stream'
 import {unified} from 'unified'
 import remarkParse from 'remark-parse'
+import remarkSlug from 'remark-slug'
+import remarkToc from 'remark-toc'
 import remarkRehype from 'remark-rehype'
+import rehypeDocument from 'rehype-document'
 import rehypeStringify from 'rehype-stringify'

 const processor = unified()
   .use(remarkParse)
+  .use(remarkSlug)
+  .use(remarkToc)
   .use(remarkRehype)
+  .use(rehypeDocument, {title: 'Contents'})
   .use(rehypeStringify)

 process.stdin.pipe(stream(processor)).pipe(process.stdout)
```

We pass options to `rehype-document`.
In this case, we use that to make sure we get a proper `<title>` element in our
`<head>`, as required by the HTML specification.
More options are accepted by `rehype-document`, such as which language tag to
use.
These are described in detail in its [`readme.md`][document].
Many other plugins accept options as well, so make sure to read through their
docs to learn more.

> Note that remark plugins work on a Markdown tree, and rehype plugins work on
> an HTML tree.
> It’s important that you place your `.use` calls in the correct places.

Now, when running our script like before, we’d get the following `example.html`
file:

```html
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Contents</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
<h1 id="hello-world">Hello World</h1>
<h2 id="table-of-content">Table of Content</h2>
<ul>
<li><a href="#install">Install</a></li>
<li><a href="#use">Use</a></li>
<li><a href="#license">License</a></li>
</ul>
<h2 id="install">Install</h2>
<p>A <strong>example</strong>.</p>
<h2 id="use">Use</h2>
<p>More <code>text</code>.</p>
<h2 id="license">License</h2>
<p>MIT</p>
</body>
</html>
```

> You may noticed the document isn’t formatted nicely.
> There’s a plugin for that though!
> Feel free to add [`rehype-format`][rehype-format] to the plugins, below `doc`!

💯
You’re acing it!
This is getting pretty useful, right?

In the next section, we’ll lay the groundwork for creating a report.

### Reporting

Before we check some prose (yes, we’re getting there), we’ll first switch up our
`index.js` file to print a pretty report (we’ll fill it in the next section).

We can use [`to-vfile`][to-vfile] to read and write virtual files from the file
system, and we can use [`vfile-reporter`][reporter] to report messages relating
to those files.
Let’s install those.

```sh
npm install to-vfile vfile-reporter
```

…and now unhook stdin/stdout from our example and use the file-system instead,
like so:

```diff
--- a/index.js
+++ b/index.js
@@ -1,4 +1,5 @@
-import {stream} from 'unified-stream'
+import {readSync, writeSync} from 'to-vfile'
+import {reporter} from 'vfile-reporter'
 import {unified} from 'unified'
 import remarkParse from 'remark-parse'
 import remarkSlug from 'remark-slug'
@@ -15,4 +16,15 @@ const processor = unified()
   .use(rehypeDocument, {title: 'Contents'})
   .use(rehypeStringify)

-process.stdin.pipe(stream(processor)).pipe(process.stdout)
+processor
+  .process(readSync('example.md'))
+  .then(
+    (file) => {
+      console.error(reporter(file))
+      file.extname = '.html'
+      writeSync(file)
+    },
+    (error) => {
+      throw error
+    }
+  )
```

If we now run our script on its own, without shell redirects, we get a report
showing everything’s fine:

```sh
$ node index.js
example.md: no issues found
```

But everything’s not fine, there’s a typo in the Markdown!
The next section shows how to detect prose errors by adding retext.

### Checking prose

I did notice a typo in there, so let’s check some prose to prevent that from
happening in the future.
We can use retext and its ecosystem for our natural language parsing.
As we’re writing in English, we use [`retext-english`][english] specifically to
parse English natural language.
The problem in our `example.md` file is that it has `a example` instead of
`an example`, which is conveniently checked for by
[`retext-indefinite-article`][indefinite-article].
To bridge from markup to prose, we’ll use [`remark-retext`][remark-retext].
First, let’s install these dependencies as well.

```sh
npm install remark-retext retext-english retext-indefinite-article
```

…and change our `index.js` like so:

```diff
--- a/index.js
+++ b/index.js
@@ -4,12 +4,16 @@ import {unified} from 'unified'
 import remarkParse from 'remark-parse'
 import remarkSlug from 'remark-slug'
 import remarkToc from 'remark-toc'
+import remarkRetext from 'remark-retext'
+import retextEnglish from 'retext-english'
+import retextIndefiniteArticle from 'retext-indefinite-article'
 import remarkRehype from 'remark-rehype'
 import rehypeDocument from 'rehype-document'
 import rehypeStringify from 'rehype-stringify'

 const processor = unified()
   .use(remarkParse)
+  .use(remarkRetext, unified().use(retextEnglish).use(retextIndefiniteArticle))
   .use(remarkSlug)
   .use(remarkToc)
   .use(remarkRehype)
```

As the code shows, `remark-retext` receives another `unified` middleware
pipeline.
A natural language pipeline.
The plugin will transform the origin syntax (Markdown) with the given pipeline’s
parser.
Then, it’ll run the attached plugins on the natural language syntax tree.

Now, when running our script one final time:

```sh
$ node index.js
example.md
  7:1-7:2  warning  Use `An` before `example`, not `A`  retext-indefinite-article  retext-indefinite-article

⚠ 1 warning
```

…we’ll get a useful message.

💃
You’ve got a really cool system set up already, nicely done!
That’s a wrap though, check out the next section for further exercises and
resources.

### Further exercises

Finally, check out the lists of available plugins for [retext][retext-plugins],
[remark][remark-plugins], and [rehype][rehype-plugins], and try some of them
out.

If you haven’t already, check out the other articles in the
[learn section][learn]!

<!--Definitions-->

[support]: https://github.com/unifiedjs/.github/blob/main/support.md

[parse]: https://github.com/remarkjs/remark/tree/HEAD/packages/remark-parse

[stringify]: https://github.com/rehypejs/rehype/tree/HEAD/packages/rehype-stringify

[remark-rehype]: https://github.com/remarkjs/remark-rehype

[npm]: https://www.npmjs.com

[node]: https://nodejs.org

[slug]: https://github.com/remarkjs/remark-slug

[toc]: https://github.com/remarkjs/remark-toc

[document]: https://github.com/rehypejs/rehype-document

[to-vfile]: https://github.com/vfile/to-vfile

[reporter]: https://github.com/vfile/vfile-reporter

[unified-stream]: https://github.com/unifiedjs/unified-stream

[english]: https://github.com/retextjs/retext/tree/HEAD/packages/retext-english

[indefinite-article]: https://github.com/retextjs/retext-indefinite-article

[remark-retext]: https://github.com/remarkjs/remark-retext

[retext-plugins]: https://github.com/retextjs/retext/blob/HEAD/doc/plugins.md

[remark-plugins]: https://github.com/remarkjs/remark/blob/HEAD/doc/plugins.md

[rehype-plugins]: https://github.com/rehypejs/rehype/blob/HEAD/doc/plugins.md

[rehype-raw]: https://github.com/rehypejs/rehype-raw

[rehype-format]: https://github.com/rehypejs/rehype-format

[learn]: /learn/
