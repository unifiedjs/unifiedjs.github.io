import {Box, theme} from 'unified-ui'
import styled from 'styled-components'

export const Indicator = styled(Box)`
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 100%;
  background: ${theme.colors.unified};
  vertical-align: text-top;
  position: relative;
  margin: 3px;
`
