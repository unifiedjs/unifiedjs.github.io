import React from 'react'
import PropTypes from 'prop-types'
import MDX from '@mdx-js/runtime'
import {mdComponents} from 'unified-ui'

import Layout from './Layout'
import {Anchor} from './Anchor'

/* eslint-disable jsx-a11y/anchor-has-content */
mdComponents.a = Anchor

const GitHubMDXRenderer = ({ data }) => (
  <Layout>
    <MDX components={mdComponents}>{data.github.repository.object.text}</MDX>
  </Layout>
)

GitHubMDXRenderer.propTypes = {
  data: PropTypes.object.isRequired
}

export default GitHubMDXRenderer