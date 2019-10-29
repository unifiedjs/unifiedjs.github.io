import React from 'react'
import {
  Provider,
  Flex,
  Box,
  Image,
  Text,
  Heading,
  Button,
  Container,
  Logo
} from 'unified-ui'

import Link from '../components/Link'

const HERO_IMG =
  'https://c8r.imgix.net/db688dfd97f57c1949e758a1/undraw-working-late.svg'

export default () => (
  <Provider>
    <Container>
      <Flex maxWidth="30em" p={3} alignItems="center">
        <Box width={[1, 1 / 2, 1 / 2]}>
          <Box width={['auto', 'auto', '36em']}>
            <Heading fontSize={6}>Building a bridge between formats</Heading>
            <Text mt={2} fontSize={4} color="grays.8">
              A vibrant ecosystem for dealing with many sources of content
            </Text>
            <Box mt={5}>
              <Button as="a" fontSize={2} py={3} href="/introduction">
                Learn more
              </Button>
              <Button
                as="a"
                bg="white"
                color="unified"
                p={3}
                fontSize={2}
                href="https://opencollective.com/unified"
              >
                Support us
              </Button>
            </Box>
          </Box>
        </Box>
        <Box width={[1, 1 / 2, 1 / 2]}>
          <Image maxWidth={[1, 1, 'initial']} src={HERO_IMG} />
        </Box>
      </Flex>
    </Container>

    <Box bg="grays.0" mt={5} py={[4, 5, 6]}>
      <Container>
        <Heading as="h2" fontSize={5}>What is unified?</Heading>
        <Text color="grays.8">The text processing umbrella</Text>
        <Flex mt={[3, 4, 5]} justifyContent="space-between" flexWrap="wrap">
          <Box pr={3} width={[1, 1, 1/3]}>
            <Heading as="h2">Powerful</Heading>
            <Text mt={2} mb={3} fontSize={2} color="grays.8">
              There's a vibrant ecosystem that's well documented
              to allow developers to focus on value rather than syntax.
            </Text>
            <Link href="/usage">Look at a demo »</Link>
          </Box>
          <Box px={3} width={[1, 1, 1/3]}>
            <Heading as="h2">Extensible</Heading>
            <Text mt={2} mb={3} fontSize={2} color="grays.8">
              unified provides numerous plugins so you can
              create a table of contents from your markdown,
              linkify headings,
              or ensure your titles adhere to Chicago-style.
            </Text>
            <Link href="/usage">View plugins »</Link>
          </Box>
          <Box pl={3} width={[1, 1, 1/3]}>
            <Heading as="h2">Transformative</Heading>
            <Text mt={2} mb={3} fontSize={2} color="grays.8">
              Content is king in the modern web.
              With unified you can stitch together content
              in plain text, markdown, HTML, or MDX.
            </Text>
            <Link href="/usage">See syntaxes »</Link>
          </Box>
        </Flex>
      </Container>
    </Box>

    <Box mt={5} py={[4, 5, 6]} textAlign="center">
      <Container>
        <Heading as="h2" fontSize={5} mb={[3, 4, 6]}>Who uses unified?</Heading>

        <Flex mt={[3, 4, 5]} justifyContent="space-between" flexWrap='wrap'>
          <Box pr={3} width={[1, 1, 1/3]}>
            <Logo domain="google.com" height={64} mb={3} />
            <Box width={2/3} m='auto'>
              <Text mt={2} mb={3} fontSize={2} color="grays.8">
                <Link href="https://developers.google.com/web/fundamentals">WebFundamentals</Link> by Google uses unified to check markup and build HTML
              </Text>
            </Box>
          </Box>
          <Box px={3} width={[1, 1, 1/3]}>
            <Logo domain="nodejs.org" height={64} mb={3}  />
            <Box width={2/3} m='auto'>
              <Text mt={2} mb={3} fontSize={2} color="grays.8">
                <Link href="https://nodejs.org">Node</Link> uses unified to check markup in their docs
              </Text>
            </Box>
          </Box>
          <Box pl={3} width={[1, 1, 1/3]}>
            <Logo domain="reactjs.org" height={64} mb={3} />
            <Box width={2/3} mx='auto'>
              <Text mt={2} mb={3} fontSize={2} color="grays.8">
                <Link href="https://reactjs.org">React</Link> by Facebook uses unified through Gatsby with custom plugins to build their site
              </Text>
            </Box>
          </Box>
        </Flex>

        <Flex mt={[4, 5, 6]} justifyContent="space-between" flexWrap='wrap'>
          <Box pr={3} width={[1, 1, 1/3]}>
            <Logo domain="mozilla.com" height={64} mb={3} />
            <Box width={2/3} m='auto'>
              <Text mt={2} mb={3} fontSize={2} color="grays.8">
                <Link href="https://github.com/devtools-html/debugger.html">Debugger</Link> by Mozilla uses unified to check their markup and prose
              </Text>
            </Box>
          </Box>
          <Box px={3} width={[1, 1, 1/3]}>
            <Logo domain="gatsbyjs.com" height={64} mb={3}  />
            <Box width={2/3} m='auto'>
              <Text mt={2} mb={3} fontSize={2} color="grays.8">
                <Link href="https://gatsbyjs.org">Gatsby</Link> uses unified to process markdown for blazing fast static site generation
              </Text>
            </Box>
          </Box>
          <Box pl={3} width={[1, 1, 1/3]}>
            <Logo domain="github.com" height={64} mb={3} />
            <Box width={2/3} m='auto'>
              <Text mt={2} mb={3} fontSize={2} color="grays.8">
                <Link href="https://opensource.guide">Open Source Guides</Link> by GitHub (and you) uses unified to check markup and prose style
              </Text>
            </Box>
          </Box>
        </Flex>
      </Container>
    </Box>
  </Provider>
)
