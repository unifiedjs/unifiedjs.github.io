import React from 'react'
import PropTypes from 'prop-types'
import {graphql} from 'gatsby'
import MDX from '@mdx-js/runtime'
import {mdComponents, theme} from 'unified-ui'

import Layout from '../../components/Layout'

/* eslint-disable jsx-a11y/anchor-has-content */
mdComponents.a = props => (
  <a
    style={{
      color: theme.colors.unified,
      textDecoration: 'none'
    }}
    {...props}
  />
)

export default function Unist({data}) {
  return (
    <Layout>
      <MDX components={mdComponents}>{data.github.repository.object.text}</MDX>
    </Layout>
  )
}
Unist.propTypes = {
  data: PropTypes.object.isRequired
}

export const query = () => graphql`
  query GitHubReadme {
    github {
      repository(owner: "syntax-tree", name: "unist") {
        object(expression: "master:readme.md") {
          ... on GitHub_Blob {
            text
          }
        }
      }
    }
  }
`
