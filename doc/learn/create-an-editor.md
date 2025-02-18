---
authorGithub: wooorm
author: Titus Wormer
description: Guide that shows how to create a fancy app ✨
group: guide
modified: 2024-08-06
published: 2017-05-03
tags:
  - dingus
  - editor
  - playground
title: Create an editor
---

## Creating an editor

This guide shows how to create an interactive online editor with unified.
Something sometimes called a “playground”.
Or a “dingus”.
In it we’ll visualize syntactic properties of text by “syntax highlighting”
them.
It’s made with [React][] and runs in a browser.

For this example we’ll create an app that visualizes sentence length.
Based on a tip by [Gary Provost][gary-provost].
The visualization is based on
[a tweet by `@gregoryciotti`][gregoryciotti-tweet].

You can also [view this project][wooorm-write-music] with some more features
online.

> Stuck?
> Have an idea for another guide?
> See [`support.md`][unified-support].

### Contents

* [Case](#case)
* [Project structure](#project-structure)
* [Setting up JavaScript](#setting-up-javascript)
* [Natural language syntax tree](#natural-language-syntax-tree)
* [Virtual DOM](#virtual-dom)
* [Highlight](#highlight)
* [Further exercises](#further-exercises)

### Case

Before we start, let’s first outline what we want to make.
We want to highlight sentences in text based on how many words they have.
The user should be able to change text.
And it should highlight live.

We’ll use [esbuild][] as a bundler to compile our JavaScript to code that
works in the browser in production.
We’ll use [xo][github-sindresorhus-xo] and [prettier][] to lint and format
our code.
You can swap those out for your favorite tools.

### Project structure

Let’s first outline our project structure:

```txt
demo/
├─ bundle.mjs
├─ index.css
├─ index.html
├─ index.jsx
└─ package.json
```

…where `demo/` is our folder and `bundle.mjs` is the JavaScript generated by
compiling `index.jsx`.

Keep `index.jsx`, `index.html`, and `index.css` empty for now, and fill
`package.json` with the following:

```json
{
  "devDependencies": {
    "esbuild": "^0.23.0",
    "prettier": "^3.0.0",
    "xo": "^0.59.0"
  },
  "name": "demo",
  "prettier": {
    "bracketSpacing": false,
    "semi": false,
    "singleQuote": true,
    "tabWidth": 2,
    "trailingComma": "none",
    "useTabs": false
  },
  "private": true,
  "scripts": {
    "build": "esbuild index.jsx --bundle --format=esm --jsx=automatic --minify --outfile=bundle.mjs --target=es2020",
    "format": "prettier . --log-level warn --write && xo --fix",
    "test": "npm run build && npm run format"
  },
  "type": "module",
  "xo": {
    "envs": [
      "browser"
    ],
    "ignore": [
      "bundle.mjs"
    ],
    "prettier": true
  }
}
```

> `private: true` means you can’t accidentally publish your package
> to npm.

The above package sets up [xo][github-sindresorhus-xo], [prettier][], and
[esbuild][].
Now, after running `npm install` and `npm test` you’ll see `bundle.mjs` appear
too.

Also add `.prettierignore` file to not format our build:

```ignore
bundle.mjs
```

Fill `index.html` with the following:

```html
<!doctype html>
<meta charset="utf8" />
<title>demo</title>
<link rel="stylesheet" href="index.css" />
<div id="root"></div>
<script type="module" src="bundle.mjs"></script>
```

This links `index.css` and `bundle.mjs`, and adds an element (`#root`) which
we’ll add our editor to later.

Did you know that `<html>`, `<head>`, and `<body>` are optional?
For this example we’ll keep the HTML minimal, but feel free to add them if you
prefer them.

### Setting up JavaScript

Alright!
Now, let’s set up our JavaScript.
Start by adding the following to `index.jsx`:

```jsx twoslash
/// <reference lib="dom" />
/* eslint-env browser */
import ReactDom from 'react-dom/client'
import React from 'react'

const main = document.querySelector('#root')
if (!main) throw new Error('No root element found')
const root = ReactDom.createRoot(main)

const sample = 'The initial text.'

root.render(React.createElement(Playground))

function Playground() {
  const [text, setText] = React.useState(sample)

  return (
    <div className="editor">
      <div className="draw">
        {/* Trailing whitespace in a `textarea` is shown, but not in a `div`
        with `white-space: pre-wrap`.
        Add a `br` to make the last newline explicit. */}
        {/\n[ \t]*$/.test(text) ? <br /> : undefined}
      </div>
      <textarea
        className="write"
        onChange={(event) => setText(event.target.value)}
        rows={text.split('\n').length + 1}
        spellCheck="true"
        value={text}
      />
    </div>
  )
}
```

> Don’t forget to `npm install @types/react-dom @types/react react-dom react`.

That’s going a bit fast, I can imagine.

In `Playground`, we’re creating two elements:
a `<div>` (`.draw`) that we’ll draw our syntax highlighting in,
and a `<textarea>` (`.write`) that the user can edit.
Both are wrapped in a parent `<div>` (`.editor`).
when the user changes the text area,
`setText` is called with the new value.
Which in turn causes `text` to change.

We’ll style the text area and the drawing area exactly the same,
and position the text above the drawing area,
with the following styles:

```css
html {
  font-size: 16px;
  line-height: 1.5;
}

.editor {
  position: relative;
  max-width: 37em;
  margin: auto;
  overflow: hidden;
}

textarea,
.draw {
  margin: 0;
  padding: 0;
  width: 100%;
  border: none;
  outline: none;
  resize: none;
  overflow: hidden;
  /* Can’t use a nice font: kerning renders differently in textareas. */
  font-family: monospace;
  line-height: inherit;
  font-size: inherit;
  background: transparent;
  white-space: pre-wrap;
  word-wrap: break-word;
  font-size: inherit;
  line-height: inherit;
}

textarea {
  color: inherit;
  position: absolute;
  top: 0;
}

.draw {
  min-height: 100vh;
}
```

That’s quite a bit of code: mainly to enforce the same styles on our text and
drawing areas.

### Natural language syntax tree

Now, let’s set up our natural language syntax tree parsing.
We’ll use [`parse-english`][github-parse-english] for that.
It’s a parser for the retext ecosystem: it produces nlcst.
We don’t need plugins and we’re in a browser where size matters more,
so we can directly use utilities.

Change `index.jsx` like so:

```diff
--- a/index.jsx
+++ b/index.jsx
@@ -1,5 +1,6 @@
 /// <reference lib="dom" />
 /* eslint-env browser */
+import {ParseEnglish} from 'parse-english'
 import ReactDom from 'react-dom/client'
 import React from 'react'

@@ -8,11 +9,13 @@ if (!main) throw new Error('No root element found')
 const root = ReactDom.createRoot(main)

 const sample = 'The initial text.'
+const parser = new ParseEnglish()

 root.render(React.createElement(Playground))

 function Playground() {
   const [text, setText] = React.useState(sample)
+  const tree = parser.parse(text)

   return (
     <div className="editor">
```

> Don’t forget to `npm install parse-english`.

Sweet, now we have access to a lot of info on the text.
It still doesn’t do anything yet though.
Let’s add some usefulness.

### Virtual DOM

Our next task is to go from a natural language syntax tree to a virtual DOM.
Change `index.jsx` like so:

```diff
--- a/index.jsx
+++ b/index.jsx
@@ -1,5 +1,9 @@
 /// <reference lib="dom" />
 /* eslint-env browser */
+/**
+ * @import {Nodes, Parents} from 'nlcst'
+ */
+
 import {ParseEnglish} from 'parse-english'
 import ReactDom from 'react-dom/client'
 import React from 'react'
@@ -20,6 +24,7 @@ function Playground() {
   return (
     <div className="editor">
       <div className="draw">
+        {one(tree)}
         {/* Trailing whitespace in a `textarea` is shown, but not in a `div`
           with `white-space: pre-wrap`.
           Add a `br` to make the last newline explicit. */}
@@ -35,3 +40,39 @@ function Playground() {
     </div>
   )
 }
+
+/**
+ * @param {Parents} node
+ * @returns {Array<React.JSX.Element | string>}
+ */
+function all(node) {
+  /** @type {Array<React.JSX.Element | string>} */
+  const results = []
+  let index = -1
+
+  while (++index < node.children.length) {
+    const result = one(node.children[index])
+
+    if (Array.isArray(result)) {
+      results.push(...result)
+    } else {
+      results.push(result)
+    }
+  }
+
+  return results
+}
+
+/**
+ * @param {Nodes} node
+ * @returns {Array<React.JSX.Element | string> | React.JSX.Element | string}
+ */
+function one(node) {
+  const result = 'value' in node ? node.value : all(node)
+
+  if (node.type === 'SentenceNode') {
+    return <span>{result}</span>
+  }
+
+  return result
+}
```

> Don’t forget to `npm install @types/nlcst`.

`all` searches all children in the given `node`
and `one` returns either the “text content” of a node,
or the result of searching its children for `all` again.

When you now run `npm test` and open `index.html` in a browser,
you’ll see that the drawing area already has our text.
It’s not colored yet,
but `<span>` elements hidden with styles are wrapping sentences.

### Highlight

Now, let’s add colors.
Update `index.jsx` like so:

```diff
--- a/index.jsx
+++ b/index.jsx
@@ -7,6 +7,7 @@
 import {ParseEnglish} from 'parse-english'
 import ReactDom from 'react-dom/client'
 import React from 'react'
+import {visit} from 'unist-util-visit'

 const main = document.querySelector('#root')
 if (!main) throw new Error('No root element found')
@@ -14,6 +15,7 @@ const root = ReactDom.createRoot(main)

 const sample = 'The initial text.'
 const parser = new ParseEnglish()
+const hues = [60, 60, 60, 300, 300, 0, 0, 120, 120, 120, 120, 120, 120, 180]

 root.render(React.createElement(Playground))

@@ -71,7 +73,23 @@ function one(node) {
   const result = 'value' in node ? node.value : all(node)

   if (node.type === 'SentenceNode') {
-    return <span>{result}</span>
+    let words = 0
+
+    visit(node, 'WordNode', function () {
+      words++
+    })
+
+    const hue = words < hues.length ? hues[words] : hues.at(-1)
+
+    return (
+      <span
+        style={{
+          backgroundColor: 'hsl(' + [hue, '93%', '70%', 0.5].join(', ') + ')'
+        }}
+      >
+        {result}
+      </span>
+    )
   }

   return result
```

> Don’t forget to `npm install unist-util-visit`.

This imports [`unist-util-visit`][github-unist-util-visit] and then defines
some hues.
We’re trying to recreate that
[visual by `@gregoryciotti`][gregoryciotti-tweet].
From that image,
I deducted these hues.
But you could use any hues you like!

Then,
for each sentence,
we count its words.
Then we use an HSL color based on the number of words as the background color
of each sentence.

Try it out by running `npm test` again and viewing `index.html` in your
browser.
If everything went okay, you should see each sentence highlighted in red.

### Further exercises

💃 In your browser, you should now see `The initial text` in purple!
If you add more sentences, they each should receive colors based on how many
words they have.

It could use some better styles, but otherwise it’s a pretty cool little demo.

If you haven’t already, check out the other articles in the
[learn section][learn]!

<!--Definitions-->

[esbuild]: https://esbuild.github.io

[gary-provost]: https://en.wikipedia.org/wiki/Gary_Provost

[github-parse-english]: https://github.com/wooorm/parse-english

[github-sindresorhus-xo]: https://github.com/xojs/xo

[github-unist-util-visit]: https://github.com/syntax-tree/unist-util-visit

[gregoryciotti-tweet]: https://www.helpscout.com/blog/damn-hard-writing/

[prettier]: https://prettier.io

[react]: https://react.dev/

[unified-support]: https://github.com/unifiedjs/.github/blob/main/support.md

[wooorm-write-music]: https://wooorm.com/write-music/

[learn]: /learn/
