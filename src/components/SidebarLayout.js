import React from 'react';
import styled from 'styled-components';

import { Box, Flex, Heading, Text, theme } from 'unified-ui';

import Link from './Link';

const MOBILE_BREAKPOINT = '@media screen and (min-width: 48em)';
const SIDEBAR_WIDTH = 256;

const toggleTransform = ({ isOpen }) =>
  isOpen ? { transform: 'none' } : { transform: 'translateX(-100%)' };

const UnstyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`;

export const SidebarLayout = styled(Flex)`
  min-height: 100vh;
  max-width: 1024px;
  margin: auto;
  background-color: white;
`;

SidebarLayout.Main = styled(Box)`
  min-height: calc(100vh - 200px);

  ${MOBILE_BREAKPOINT} {
    padding-left: ${SIDEBAR_WIDTH}px;
  }
`;
SidebarLayout.Main.defaultProps = {
  mt: 4
};

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

  ${toggleTransform} ${MOBILE_BREAKPOINT} {
    transform: none;
  }
`;
NavWrap.defaultProps = {
  p: 4
};

const SidebarSpacer = styled.div`
  ${MOBILE_BREAKPOINT} {
    width: ${SIDEBAR_WIDTH};
  }
`;

const MobileOnly = styled.div`
  ${MOBILE_BREAKPOINT} {
    display: none;
  }
`;

const MenuIcon = ({ size = 24, ...props }) => (
  <svg
    {...props}
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="currentcolor"
  >
    <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
  </svg>
);

SidebarLayout.Title = ({ href, logo, children }) => (
  <UnstyledLink href={href}>
    <Flex alignItems="center">
      <Box>{logo}</Box>
      <Text>{children}</Text>
    </Flex>
  </UnstyledLink>
);

SidebarLayout.NavGroup = styled(Box)`
  list-style-type: none;
  margin: 0;
  padding: 0;
`;
SidebarLayout.NavGroup.defaultProps = {
  as: 'ul'
};

SidebarLayout.NavItem = props => (
  <Text as="li" fontSize={2} color="grays.8">
    <UnstyledLink
      activeStyle={{
        color: theme.colors.unified
      }}
      {...props}
    />
  </Text>
);

SidebarLayout.NavHeading = props => (
  <Heading mt={4} mb={2} fontSize={2} {...props} />
);

SidebarLayout.Nav = props => (
  <nav>
    <NavWrap {...props} />
  </nav>
);
