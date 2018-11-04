import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {Box, Flex, Heading, Text, theme} from 'unified-ui'
import {Indicator} from './Indicator'
import Link from './Link'

const BIG_BREAKPOINT = '@media screen and (min-width: 48em)'
const SIDEBAR_WIDTH = 256

const toggleTransform = ({isOpen}) =>
  isOpen ? {transform: 'none'} : {transform: 'translateX(-100%)'}

const UnstyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`

export const SidebarLayout = styled(Flex)`
  min-height: 100vh;
  max-width: 64em;
  margin: auto;
  background-color: white;
`

SidebarLayout.Main = styled(Box)`
  min-height: calc(100vh - 200px);

  ${BIG_BREAKPOINT} {
    padding-left: ${SIDEBAR_WIDTH}px;
  }
`
SidebarLayout.Main.defaultProps = {
  p: 4
}

const NavWrap = styled(Box)`
  width: ${SIDEBAR_WIDTH}px;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  overflow-y: auto;
  webkitoverflowscrolling: touch;
  transition: transform 0.2s ease-out;
  background-color: white;

  ${toggleTransform} ${BIG_BREAKPOINT} {
    transform: none;
  }
`
NavWrap.defaultProps = {
  p: 4
}

SidebarLayout.Title = ({href, logo, children}) => (
  <UnstyledLink href={href}>
    <Flex alignItems="center">
      <Box>{logo}</Box>
      <Text>{children}</Text>
    </Flex>
  </UnstyledLink>
)
SidebarLayout.Title.propTypes = {
  href: PropTypes.string.isRequired,
  logo: PropTypes.node,
  children: PropTypes.node
}
SidebarLayout.Title.defaultProps = {
  logo: null,
  children: null
}

SidebarLayout.NavGroup = styled(Box)`
  list-style-type: none;
  margin: 0;
  padding: 0;
`
SidebarLayout.NavGroup.defaultProps = {
  as: 'ul'
}

SidebarLayout.NavItem = ({isNew, ...props}) => (
  <Text as="li" fontSize={2} color="grays.8">
    <UnstyledLink activeStyle={{color: theme.colors.unified}} {...props} />
    {isNew && <Indicator />}
  </Text>
)

SidebarLayout.NavHeading = props => (
  <Heading mt={4} mb={2} fontSize={2} {...props} />
)

SidebarLayout.Bar = styled(Box)`
  width: 100%;
  height: 5px;
  background: ${theme.colors.unified};
  position: fixed;
  z-index: 1;
`

SidebarLayout.Nav = props => (
  <nav>
    <NavWrap {...props} />
  </nav>
)
