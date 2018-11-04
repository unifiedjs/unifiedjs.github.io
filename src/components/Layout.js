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
          <SidebarLayout.Bar />
          <SidebarLayout>
            <SidebarLayout.Nav>
              <SidebarLayout.Title href="/">
                <Logo type="initials" name={data.site.siteMetadata.title} />
              </SidebarLayout.Title>

              <SidebarLayout.NavGroup>
                <SidebarLayout.NavHeading>Contents</SidebarLayout.NavHeading>
                <SidebarLayout.NavItem href="/about">
                  About
                </SidebarLayout.NavItem>
                <SidebarLayout.NavItem href="/projects">
                  Projects
                </SidebarLayout.NavItem>
                <SidebarLayout.NavItem isNew href="/micromark">
                  micromark
                </SidebarLayout.NavItem>
                <SidebarLayout.NavItem isNew href="/collective">
                  Collective
                </SidebarLayout.NavItem>
                <SidebarLayout.NavItem href="/blog">Blog</SidebarLayout.NavItem>
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
