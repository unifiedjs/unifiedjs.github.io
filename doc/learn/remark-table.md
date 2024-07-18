---
group: recipe
index: 5
title: Support tables in remark
description: How to support GitHub-style tables in remark (or react-markdown)
tags:
  - remark
  - plugin
  - gfm
  - github
  - table
author: Titus Wormer
authorTwitter: wooorm
authorGithub: wooorm
published: 2021-02-24
modified: 2021-02-24
---

## How to support tables in remark

Tables are a non-standard feature in markdown: they are **not** defined in
[CommonMark][] and will not work everywhere.

Tables are an extension that GitHub supports in their [GFM][].
They work on `github.com` in most places: a readme, issue, PR, discussion,
comment, etc.

remark and unified can support them through a plugin:
[`remark-gfm`][remark-gfm].

### Contents

* [What are tables?](#what-are-tables)
* [How to write tables](#how-to-write-tables)
* [How to support tables](#how-to-support-tables)
* [How to support tables in `react-markdown`](#how-to-support-tables-in-react-markdown)

### What are tables?

Tables in markdown are used for tabular data and look like this:

```markdown
| Beep |   No.  |   Boop |
| :--- | :----: | -----: |
| beep |  1024  |    xyz |
| boop | 338845 |    tuv |
| foo  |  10106 | qrstuv |
| bar  |   45   |   lmno |
```

The result on a website would look something like this:

| Beep |   No.  |   Boop |
| :--- | :----: | -----: |
| beep |  1024  |    xyz |
| boop | 338845 |    tuv |
| foo  |  10106 | qrstuv |
| bar  |   45   |   lmno |

### How to write tables

Use pipe characters (`|`) between cells in a row.
A new line starts a new row.
You don’t have to align the pipes (`|`) to form a nice grid, but it does make
the source more readable.

The first row is the *table header* and its cells are the labels for their
respective column.

The second row is the *alignment row* and each “cell” must include a dash (`-`).
A cell can be aligned left with a colon at the start (`:--`), aligned right with
a colon at the end (`--:`), or aligned center with colons at the start and end
(`:-:`).

Further rows are the *table body* and are optional.
Their cells are the table data.

### How to support tables

As tables are non-standard, remark does not support them by default.
But it can support them with a plugin: [`remark-gfm`][remark-gfm].
Let’s say we have some markdown with a GFM table, in an `example.md` file:

```markdown
# Table

| Branch  | Commit           |
| ------- | ---------------- |
| main    | 0123456789abcdef |
| staging | fedcba9876543210 |
```

And a script set up to transform markdown with tables to HTML, `example.js`:

```javascript
import fs from 'node:fs'
import {unified} from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'

const doc = fs.readFileSync('example.md')

const file = unified()
  .use(remarkParse) // Parse markdown.
  .use(remarkGfm) // Support GFM (tables, autolinks, tasklists, strikethrough).
  .use(remarkRehype) // Turn it into HTML.
  .use(rehypeStringify) // Serialize HTML.
  .processSync(doc)

console.log(String(file))
```

Now, running `node example` yields:

```html
<h1>Table</h1>
<table>
<thead>
<tr>
<th>Branch</th>
<th>Commit</th>
</tr>
</thead>
<tbody>
<tr>
<td>main</td>
<td>0123456789abcdef</td>
</tr>
<tr>
<td>staging</td>
<td>fedcba9876543210</td>
</tr>
</tbody>
</table>
```

### How to support tables in `react-markdown`

As tables are non-standard, `react-markdown` does not support them by default.
But it can support them with a plugin: [`remark-gfm`][remark-gfm].

Let’s say we have some markdown with a GFM table, in an `example.md` file:

```js
import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const markdown = `# Table

| Branch  | Commit           |
| ------- | ---------------- |
| main    | 0123456789abcdef |
| staging | fedcba9876543210 |`

console.log(<ReactMarkdown plugins={[remarkGfm]} children={markdown} />)
```

Yields in JSX:

```javascript
<>
  <h1>Table</h1>
  <table>
    <thead>
      <tr>
        <th>Branch</th>
        <th>Commit</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>main</td>
        <td>0123456789abcdef</td>
      </tr>
      <tr>
        <td>staging</td>
        <td>fedcba9876543210</td>
      </tr>
    </tbody>
  </table>
</>
```

[commonmark]: https://commonmark.org

[gfm]: https://github.github.com/gfm/

[remark-gfm]: https://github.com/remarkjs/remark-gfm
