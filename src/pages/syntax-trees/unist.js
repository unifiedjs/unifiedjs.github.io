import React from 'react'
import PropTypes from 'prop-types'
import {graphql} from 'gatsby'
import MDX from '@mdx-js/runtime'
import {mdComponents} from 'unified-ui'

import Layout from '../../components/Layout'
import {Anchor} from '../../components/Anchor'

/* eslint-disable jsx-a11y/anchor-has-content */
mdComponents.a = Anchor

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
