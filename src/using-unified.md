## Using unified

This guide delves into how unified can be used to
transform a markdown file to HTML.  It’ll also show how to
generate a table of contents, and sidestep into checking prose.

> Stuck?  A good place to get help fast is [Gitter][gitter].
> Have an idea for another guide?  Share it on Gitter!

### Contents

*   [Tree transformations](#tree-transformations)
*   [Plugins](#plugins)
*   [Reporting](#reporting)
*   [Checking prose](#checking-prose)
*   [Further exercises](#further-exercises)

### Tree transformations

For this example, we’ll start out with markdown content,
then transform to HTML.  We need a markdown parser and an
HTML stringifier for that.  The relevant projects are
respectively [`remark-parse`][parse] and
[`rehype-stringify`][stringify].
To transform between the two syntaxes, we’ll use
[`remark-rehype`][remark-rehype].  Finally, we’ll use unified
itself to glue these together, and [`unified-stream`][unified-stream]
for streaming.

Let’s install those with [npm][], which comes bundled with [Node][].

```bash sh
$ npm install unified unified-stream remark-parse remark-rehype rehype-stringify
/Users/tilde/example
├── rehype-stringify@3.0.0
├── remark-parse@4.0.0
├── remark-rehype@2.0.1
├── unified-stream@1.0.1
└── unified@6.1.5
```

Let’s first create a markdown file that we’re going
to transform.

```markdown example.md
# Hello World

## Table of Content

## Install

A **example**.

## Use

More `text`.

## License

MIT
```

Then, create an `index.js` script as well.  It’ll transform markdown
to HTML.  It’s hooked up to read from stdin and write to stdout.

```javascript index.js
var unified = require('unified');
var stream = require('unified-stream');
var markdown = require('remark-parse');
var remark2rehype = require('remark-rehype');
var html = require('rehype-stringify');

var processor = unified()
  .use(markdown)
  .use(remark2rehype)
  .use(html);

process.stdin.pipe(stream(processor)).pipe(process.stdout);
```

Now, running our script with [Node][] (this uses your Shell to read
`example.md` and write `example.html`):

```bash sh
$ node index.js < example.md > example.html
```

...gives us an `example.html` file that looks as follows:

```html example.html
<h1>Hello World</h1>
<h2>Table of Content</h2>
<h2>Install</h2>
<p>A <strong>example</strong>.</p>
<h2>Use</h2>
<p>More <code>text</code>.</p>
<h2>License</h2>
<p>MIT</p>
```

> Note that [`remark-rehype`][remark-rehype] doesn’t deal with HTML inside
> the markdown.  You’ll need [`rehype-raw`][rehype-raw] if you’re planning
> on doing that.

🎉 Nifty!  It doesn’t do much yet, but we’ll get there.
In the next section, we’ll make this more useful by
introducing plugins.

### Plugins

We’re still missing some things, notably a table of
contents, and proper HTML document structure.

Respectively, we can use [`remark-toc`][toc] and
[`rehype-document`][document] to do these two tasks.

```bash sh
$ npm install remark-toc rehype-document
/Users/tilde/example
├── remark-toc@4.0.1
└── rehype-document@2.0.1
```

Let’s now use those two as well, by modifying our
`index.js` file:

```diff index.js
 var unified = require('unified');
 var stream = require('unified-stream');
 var markdown = require('remark-parse');
+var toc = require('remark-toc');
 var remark2rehype = require('remark-rehype');
+var doc = require('rehype-document');
 var html = require('rehype-stringify');

 var processor = unified()
   .use(markdown)
+  .use(toc)
   .use(remark2rehype)
+  .use(doc, {title: 'Contents'})
   .use(html);

 process.stdin.pipe(stream(processor)).pipe(process.stdout);
```

We pass options to `rehype-document`.  In this case, we use that to make
sure we get a proper `<title>` element in our `<head>`, as required by
the HTML specification.  More options are accepted by `rehype-document`, such
as which language tag to use.  These are described in detail in its
[`readme.md`][document].  Many other plugins accept options as well,
so make sure to read through their docs when you’ve got the time.

> Note that remark plugins work on a markdown tree, and rehype
> plugins work on an HTML tree.  It’s important that you place
> your `.use` calls in the correct places.

Now, when running our script like before, we’d get the
following `example.html` file:

```html example.html
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

> You may noticed the document isn’t formatted nicely.  There’s a
> plugin for that though!  Feel free to add
> [`rehype-format`][rehype-format] to the plugins, below `doc`!

💯 You’re acing it!  This is getting pretty useful, right?

In the next section, we’ll lay the groundwork for creating
a report.

### Reporting

Before we check some prose (yes, we’re getting there), we’ll first
switch up our `index.js` file to print a pretty report (we’ll fill
it in the next section).

We can use [`to-vfile`][to-vfile] to read and write virtual files from
the file-system, and we can use [`vfile-reporter`][reporter] to report
messages relating to those files.  Let’s install those.

```bash sh
$ npm install to-vfile vfile-reporter
/Users/tilde/example
├── to-vfile@2.1.2
└── vfile-reporter@4.0.0
```

...and now unhook stdin/stdout from our example and use
the file-system instead, like so:

```diff index.js
 var unified = require('unified');
-var stream = require('unified-stream');
+var vfile = require('to-vfile');
+var report = require('vfile-reporter');
 var markdown = require('remark-parse');
 var toc = require('remark-toc');
 var remark2rehype = require('remark-rehype');
 var doc = require('rehype-document');
 var html = require('rehype-stringify');

 var processor = unified()
   .use(markdown)
   .use(toc)
   .use(remark2rehype)
   .use(doc, {title: 'Contents'})
   .use(html);

-process.stdin.pipe(stream(processor)).pipe(process.stdout);
+processor.process(vfile.readSync('example.md'), function (err, file) {
+  if (err) throw err;
+  console.error(report(file));
+  file.extname = '.html';
+  vfile.writeSync(file);
+});
```

If we now run our script on its own, without shell redirects,
we get a report showing everything’s fine:

```bash sh
$ node index.js
example.md: no issues found
```

But everything’s not fine, there’s a typo in the markdown!
The next section shows how to detect prose errors by adding retext.

### Checking prose

I did notice a typo in there, so let’s check some prose to prevent
that from happening in the future.  We can use retext and its ecosystem
for our natural language parsing.  As we’re writing in English, we use
[`retext-english`][english] specifically to parse English natural
language.  The problem in our `example.md` file is that it has
`a example` instead of `an example`, which is conveniently checked for
by [`retext-indefinite-article`][indefinite-article].  To bridge from
markup to prose, we’ll use [`remark-retext`][remark-retext].  First,
let’s install these dependencies as well.

```bash sh
$ npm install remark-retext retext-english retext-indefinite-article
/Users/tilde/example
├── remark-retext@3.1.0
├── retext-english@3.0.0
└── retext-indefinite-article@1.1.2
```

...and change our `index.js` like so:

```diff index.js
 var unified = require('unified');
 var vfile = require('to-vfile');
 var report = require('vfile-reporter');
 var markdown = require('remark-parse');
 var toc = require('remark-toc');
+var remark2retext = require('remark-retext');
+var english = require('retext-english');
+var indefiniteArticle = require('retext-indefinite-article');
 var remark2rehype = require('remark-rehype');
 var doc = require('rehype-document');
 var html = require('rehype-stringify');

 var processor = unified()
   .use(markdown)
+  .use(remark2retext, unified().use(english).use(indefiniteArticle))
   .use(toc)
   .use(remark2rehype)
   .use(doc, {title: 'Contents'})
   .use(html);

 processor.process(vfile.readSync('example.md'), function (err, file) {
   if (err) throw err;
   console.error(report(file));
   file.extname = '.html';
   vfile.writeSync(file);
 });
```

As the code shows, `remark-retext` receives another `unified`
middleware pipeline.  A natural language pipeline.  The plugin
will transform the origin syntax (markdown) with the given pipeline’s parser.
Then, it’ll run the attached plugins on the natural language syntax tree.

Now, when running our script one final time:

```bash sh
$ node index.js
example.md
  7:1-7:2  warning  Use `An` before `example`, not `A`  retext-indefinite-article  retext-indefinite-article

⚠ 1 warning
```

...we’ll get a useful message.

💃 You’ve got a really cool system set up already, nicely done!
That’s a wrap though, check out the next section for further
exercises and resources.

### Further exercises

Finally, check out the lists of available plugins
for [retext][retext-plugins], [remark][remark-plugins], and
[rehype][rehype-plugins], and try some of them out.

If you haven’t already, check out the other [guides][]!

<!--Definitions-->

[gitter]: https://gitter.im/unifiedjs/Lobby

[parse]: https://github.com/remarkjs/remark/tree/master/packages/remark-parse

[stringify]: https://github.com/rehypejs/rehype/tree/master/packages/rehype-stringify

[remark-rehype]: https://github.com/remarkjs/remark-rehype

[npm]: https://www.npmjs.com

[node]: https://nodejs.org

[toc]: https://github.com/remarkjs/remark-toc

[document]: https://github.com/rehypejs/rehype-document

[to-vfile]: https://github.com/vfile/to-vfile

[reporter]: https://github.com/vfile/vfile-reporter

[unified-stream]: https://github.com/unifiedjs/unified-stream

[english]: https://github.com/retextjs/retext/tree/master/packages/retext-english

[indefinite-article]: https://github.com/retextjs/retext-indefinite-article

[remark-retext]: https://github.com/remarkjs/remark-retext

[retext-plugins]: https://github.com/retextjs/retext/blob/master/doc/plugins.md

[remark-plugins]: https://github.com/remarkjs/remark/blob/master/doc/plugins.md

[rehype-plugins]: https://github.com/rehypejs/rehype/blob/master/doc/plugins.md

[rehype-raw]: https://github.com/rehypejs/rehype-raw

[rehype-format]: https://github.com/rehypejs/rehype-format

[guides]: /#guides
