const base = 'https://github.com/'

export const wordMap = {
  unified: 'uni|fied',
  'syntax-tree': 'syntax|-tree',
  unist: 'uni|st',
  vfile: 'v|file',
  remark: 're|mark',
  micromark: 'micro|mark',
  mdast: 'md|ast',
  rehype: 're|hype',
  hast: 'h|ast',
  retext: 're|text',
  nlcst: 'nl|cst',
  mdx: 'm|dx'
}

export const initialMap = {
  unified: 'u|ni',
  unist: 's|t',
  'syntax-tree': 's|t',
  vfile: 'v|f',
  remark: 'r|e',
  micromark: 'm|m',
  mdast: 'm|a',
  rehype: 'r|e',
  hast: 'h|a',
  retext: 'r|e',
  nlcst: 'n|c',
  mdx: 'm|dx'
}

export const colors = {
  unified: 'unified',
  unist: 'unified',
  vfile: 'unified',
  remark: 'remark',
  micromark: 'remark',
  mdast: 'remark',
  rehype: 'rehype',
  hast: 'rehype',
  retext: 'retext',
  nlcst: 'retext',
  mdx: 'mdx'
}

export const urls = {
  [base + 'unifiedjs/unified']: 'unified',
  [base + 'syntax-tree']: ['syntax-tree', 'unist'],
  [base + 'syntax-tree/unist']: 'unist',
  [base + 'vfile/vfile']: 'vfile',
  [base + 'remarkjs/remark']: 'remark',
  [base + 'remarkjs']: 'remark',
  [base + 'micromark/micromark']: 'micromark',
  [base + 'micromark']: 'micromark',
  [base + 'syntax-tree/mdast']: 'mdast',
  [base + 'rehypejs/rehype']: 'rehype',
  [base + 'rehypejs']: 'rehype',
  [base + 'syntax-tree/hast']: 'hast',
  [base + 'retextjs/retext']: 'retext',
  [base + 'retextjs']: 'retext',
  [base + 'syntax-tree/nlcst']: 'nlcst',
  [base + 'mdx-js']: 'mdx',
  [base + 'mdx-js/mdx']: 'mdx'
}
