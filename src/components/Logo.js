import React from 'react'
import {Text} from 'unified-ui'

const map = {
  unified: 'uni|fied',
  vfile: 'v|file',
  remark: 're|mark',
  retext: 're|text',
  rehype: 're|hype',
  unist: 'uni|st',
  nlcst: 'nl|cst',
  mdast: 'md|ast',
  hast: 'h|ast'
}

export const Logo = ({name, ...props}) => {
  const value = name.toLowerCase()
  const split = map[value].split('|')

  return (
    <Text as="span" {...props}>
      <Text as="span" color={value}>
        {split[0]}
      </Text>
      {split[1]}
    </Text>
  )
}
