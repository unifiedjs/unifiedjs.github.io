unist discloses documents as syntax trees.
Syntax trees come in two flavours: Concrete (CST) and Abstract (AST).
The first has all information needed to restore the original document completely, the latter does not.
But, ASTs can recreate an exact syntactic representation.
For example, CSTs house info on style such as tabs or spaces, but ASTs do not.
This makes ASTs often easier to work with.

For example, say we have the following HTML element:

```html
<a href="https://github.com/unifiedjs/unified" class="highlight">
  Fork on GitHub
</a>
```

Yields (in hast, an abstract syntax tree):

```json
{
  "type": "element",
  "tagName": "a",
  "properties": {
    "href": "https://github.com/unifiedjs/unified",
    "className": ["highlight"]
  },
  "children": [
    {"type": "text", "value": "\n  Fork on GitHub\n"}
  ]
}
```

These trees also come with positional information (not shown above), so every node knows where it originates from.

Read more about unist in it’s readme.
