import { Unified as UnifiedExample } from '../components/Examples'

# Unified

unified is an interface for processing text with syntax trees and transforming between them.

<UnifiedExample />

## Core

The unified library itself is a small module and a rather small API.
Plugins do everything else: minify HTML, lint markdown, check indefinite articles (“a”, “an”), and more.

Three syntaxes are connected to unified, each coming with a syntax tree definition, and a parser and stringifier: mdast with remark for markdown, nlcst with retext for prose, and hast with rehype for HTML.

unified defers part of its logic to vfile, which is a virtual file format representing documents being processed, and unist, a schema for syntax trees.

## Syntaxes

- remark for Markdown
- rehype for HTML
- retext for natural language
- MDX for JSX in Markdown

## Virtual files

vfile stores metadata about documents being processed (often, but not always, from the file system).
Mainly, it houses a path to files, and their contents. Additionally, it tracks messages associated with files and where they occurred.
This powers code linting, shown below with remark-cli, remark-validate-links, and remark-preset-lint-consistent.

Read more about vfile in it’s readme.

## Linting with unified

- WebFundamentals by Google
- Node
- React by Facebook
- debugger by Mozilla
- Gatsby
- Open Source Guides by GitHub

## Syntax tree

unist discloses documents as syntax trees.
Syntax trees come in two flavours: Concrete (CST) and Abstract (AST).
The first has all information needed to restore the original document completely, the latter does not.
But, ASTs can recreate an exact syntactic representation.
For example, CSTs house info on style such as tabs or spaces, but ASTs do not.
This makes ASTs often easier to work with.

For example, say we have the following HTML element:

Yields (in hast, an abstract syntax tree):

These trees also come with positional information (not shown above), so every node knows where it originates from.

Read more about unist in it’s readme.

## Built with unified

### write-music

write-music visualises sentence length with unified.
Varying sentence length can make reading more enjoyable.

### awesome-lint

awesome-lint uses unified to make it easier to create and maintain Awesome lists.

### how-to-markdown

how-to-markdown, a core NodeSchool workshopper, uses unified to teach markdown

### documentation.js

documentation.js uses unified to generate formatted docs

### readability

readability measures ease of reading of text.
It uses several formulas.
Green means text should be readable for your target audience.
