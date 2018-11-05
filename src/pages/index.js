import React from 'react'
import {Provider,Flex, Box, Image, Text, Heading, Button} from 'unified-ui'

export default () => (
  <Provider>
    <>
      <Flex maxWidth='30em' p={3} alignItems="center">
        <Box width={[1, 1/2, 1/2]}>
          <Box width={['auto', 'auto', '36em']}>
            <Heading fontSize={6}>Building a bridge between formats</Heading>
            <Text mt={2} fontSize={4}>With a vibrant ecosystem for dealing with many sources of content</Text>
            <Box mt={5}>
              <Button fontSize={2} py={3} href="/introduction">
                Learn more
              </Button>
              <Button bg="white" color="unified" p={3} fontSize={2} href="https://opencollective.com/unified">
                Support us
              </Button>
            </Box>
          </Box>
        </Box>
        <Box width={[1, 1/2, 1/2]}>
          <Image
            maxWidth={[1, 1, 'initial']}
            src="https://c8r.imgix.net/db688dfd97f57c1949e758a1/undraw-working-late.svg"
          />
        </Box>
      </Flex>
    </>
  </Provider>
)
