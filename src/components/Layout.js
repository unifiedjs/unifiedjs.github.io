import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import {StaticQuery, graphql} from 'gatsby'
import {Provider} from 'unified-ui'

import {SidebarLayout} from './SidebarLayout'
import {Logo} from './Logo'

import '../base.css'

const Layout = ({children}) => (
  <StaticQuery
    query={graphql`
      query SiteTitleQuery {
        site {
          siteMetadata {
            title
            description
            keywords
          }
        }
      }
    `}
    render={data => (
      <>
        <Helmet
          defaultTitle={data.site.siteMetadata.title}
          titleTemplate={'%s - ' + data.site.siteMetadata.title}
        >
          <html lang="en" />
          <meta
            name="description"
            content={data.site.siteMetadata.description}
          />
          <meta
            name="keywords"
            content={data.site.siteMetadata.keywords.join(',')}
          />
        </Helmet>
        <Provider>
          <SidebarLayout>
            <SidebarLayout.Nav>
              <SidebarLayout.Title href="/">
                <Logo name={data.site.siteMetadata.title} />
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
