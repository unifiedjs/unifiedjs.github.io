---
authorGithub: wooorm
author: Titus Wormer
description: Guide that shows how to create a remark plugin
group: guide
modified: 2024-08-13
published: 2024-08-13
tags:
  - mdast
  - plugin
  - remark
title: Create a remark plugin
---

## Create a remark plugin

This guide shows how to create a plugin for remark that turns emoji
shortcodes ([gemoji][], such as `:+1:`) into Unicode emoji (`👍`).
It looks for a regex in the text and replaces it.

> Stuck?
> Have an idea for another guide?
> See [`support.md`][support].

### Contents

* [Case](#case)
* [Setting up](#setting-up)
* [Plugin](#plugin)

### Case

Before we start, let’s first outline what we want to make.
Say we have the following file:

```markdown
Look, the moon :new_moon_with_face:
```

And we’d like to turn that into:

```markdown
Look, the moon 🌚
```

In the next step we’ll write the code to use our plugin.

### Setting up

Let’s set up a project.
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
@@ -1,6 +1,7 @@
 {
   "name": "example",
   "version": "1.0.0",
+  "type": "module",
   "main": "index.js",
   "scripts": {
     "test": "echo \"Error: no test specified\" && exit 1"
```

Make sure `input.md` exists with:

```markdown
Look, the moon :new_moon_with_face:
```

Now, let’s create an `example.js` file that will process our file and report
any found problems.

```js twoslash
// @filename: plugin.d.ts
import type {Root} from 'mdast'
export default function remarkGemoji(): (tree: Root) => undefined;
// @filename: example.js
/// <reference types="node" />
// ---cut---
import fs from 'node:fs/promises'
import {remark} from 'remark'
import remarkGemoji from './plugin.js'

const document = await fs.readFile('input.md', 'utf8')

const file = await remark().use(remarkGemoji).process(document)

await fs.writeFile('output.md', String(file))
```

> Don’t forget to `npm install remark`!

If you read the guide on [using unified][use],
you’ll see some familiar statements.
First,
we load dependencies,
then we read the file in.
We process that file with the plugin we’ll create next and finally we write
it out again.

Note that we directly depend on `remark`.
This is a package that exposes a `unified` processor,
and comes with the markdown parser and markdown compiler attached.

Now we’ve got everything set up except for the plugin itself.
We’ll do that in the next section.

### Plugin

We’ll need a plugin, and for our case also a transform.
Let’s create them in our plugin file `plugin.js`:

```js twoslash
/**
 * @import {Root} from 'mdast'
 */

/**
 * Turn gemoji shortcodes (`:+1:`) into emoji (`👍`).
 *
 * @returns
 *   Transform.
 */
export default function remarkGemoji() {
  /**
   * @param {Root} tree
   * @return {undefined}
   */
  return function (tree) {
  }
}
```

That’s how most plugins start.
A function that returns another function.

For this use case,
we could walk the tree and replace nodes with
[`unist-util-visit`][visit],
which is how many plugins work.
But a different utility is even simpler:
[`mdast-util-find-and-replace`][find-and-replace].
It looks for a regex and lets you then replace that match.

Let’s add that.

```diff
--- a/plugin.js
+++ b/plugin.js
@@ -2,6 +2,8 @@
  * @import {Root} from 'mdast'
  */

+import {findAndReplace} from 'mdast-util-find-and-replace'
+
 /**
  * Turn gemoji shortcodes (`:+1:`) into emoji (`👍`).
  *
@@ -14,5 +16,16 @@ export default function remarkGemoji() {
    * @return {undefined}
    */
   return function (tree) {
+    findAndReplace(tree, [
+      /:(\+1|[-\w]+):/g,
+      /**
+       * @param {string} _
+       * @param {string} $1
+       * @return {undefined}
+       */
+      function (_, $1) {
+        console.log(arguments)
+      }
+    ])
   }
 }
```

> Don’t forget to `npm install mdast-util-find-and-replace`!

If we now run our example with Node.js,
we’ll see that `console.log` is called:

```sh
node example.js
```

```text
[Arguments] {
  '0': ':new_moon_with_face:',
  '1': 'new_moon_with_face',
  '2': {
    index: 15,
    input: 'Look, the moon :new_moon_with_face:',
    stack: [ [Object], [Object], [Object] ]
  }
}
```

This output shows that the regular expression matches the emoji shortcode.
The second argument is the name of the emoji.
That’s what we want.

We can look that name up to find the corresponding Unicode emoji.
We can use the [`gemoji`][gemoji] package for that.
It exposes a `nameToEmoji` record.

```diff
--- a/plugin.js
+++ b/plugin.js
@@ -2,6 +2,7 @@
  * @import {Root} from 'mdast'
  */

+import {nameToEmoji} from 'gemoji'
 import {findAndReplace} from 'mdast-util-find-and-replace'

 /**
@@ -21,10 +22,10 @@ export default function remarkGemoji() {
       /**
        * @param {string} _
        * @param {string} $1
-       * @return {undefined}
+       * @return {string | false}
        */
       function (_, $1) {
-        console.log(arguments)
+        return Object.hasOwn(nameToEmoji, $1) ? nameToEmoji[$1] : false
       }
     ])
   }
```

> Don’t forget to `npm install gemoji`!

If we now run our example again with Node…

```sh
node example.js
```

…and open `output.md`,
we’ll see that the shortcode is replaced with the emoji!

```markdown
Look, the moon 🌚
```

That’s it!
For a complete version of this plugin,
see [`remark-gemoji`][remark-gemoji].

If you haven’t already, check out the other articles in the
[learn section][learn]!

<!--Definitions-->

[find-and-replace]: https://github.com/syntax-tree/mdast-util-find-and-replace

[gemoji]: https://github.com/wooorm/gemoji/blob/main/support.md

[learn]: /learn/

[remark-gemoji]: https://github.com/remarkjs/remark-gemoji

[support]: https://github.com/unifiedjs/.github/blob/main/support.md

[use]: /learn/guide/using-unified/

[visit]: https://github.com/syntax-tree/unist-util-visit
