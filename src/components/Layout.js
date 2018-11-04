import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import {StaticQuery, graphql} from 'gatsby'
import {Provider} from 'unified-ui'

import {SidebarLayout} from './SidebarLayout'
import {Unified} from './Logo'

import '../base.css'

const Layout = ({children}) => (
  <StaticQuery
    query={graphql`
      query SiteTitleQuery {
        site {
          siteMetadata {
            title
          }
        }
      }
    `}
    render={data => (
      <>
        <Helmet
          title={data.site.siteMetadata.title}
          meta={[
            {name: 'description', content: 'Sample'},
            {name: 'keywords', content: 'sample, something'}
          ]}
        >
          <html lang="en" />
        </Helmet>
        <Provider>
          <SidebarLayout>
            <SidebarLayout.Nav>
              <SidebarLayout.Title href="/">
                <Unified />
              </SidebarLayout.Title>

              <SidebarLayout.NavGroup>
                <SidebarLayout.NavHeading>
                  Getting started
                </SidebarLayout.NavHeading>
                <SidebarLayout.NavItem href="/introduction">
                  Introduction
                </SidebarLayout.NavItem>
                <SidebarLayout.NavItem href="/installation">
                  Installation
                </SidebarLayout.NavItem>
                <SidebarLayout.NavItem href="/guides">
                  Usage
                </SidebarLayout.NavItem>
              </SidebarLayout.NavGroup>

              <SidebarLayout.NavGroup>
                <SidebarLayout.NavHeading>Guides</SidebarLayout.NavHeading>
                <SidebarLayout.NavItem href="/guides/use-unified">
                  Use unified
                </SidebarLayout.NavItem>
                <SidebarLayout.NavItem href="/guides/write-mdx">
                  Write with MDX
                </SidebarLayout.NavItem>
                <SidebarLayout.NavItem href="/guides/create-plugin">
                  Create a plugin{' '}
                </SidebarLayout.NavItem>
                <SidebarLayout.NavItem href="/guides/create-online-editor">
                  Create an online editor
                </SidebarLayout.NavItem>
              </SidebarLayout.NavGroup>
            </SidebarLayout.Nav>

            <SidebarLayout.Main>{children}</SidebarLayout.Main>
          </SidebarLayout>
        </Provider>
      </>
    )}
  />
)

Layout.propTypes = {
  children: PropTypes.node.isRequired
}

export default Layout
