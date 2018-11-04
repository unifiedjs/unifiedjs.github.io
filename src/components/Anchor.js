import React from 'react'
import {theme} from 'unified-ui'
import {urls} from '../names'
import {Logo} from './Logo'

export const Anchor = ({href, ...props}) => {
  const {children} = props

  if (href in urls && urls[href] === children) {
    return (
      <a href={href} style={{color: theme.colors.blue, textDecoration: 'none'}}>
        <Logo highlightOnHover name={children} {...props} />
      </a>
    )
  }

  return (
    <a
      href={href}
      style={{color: theme.colors.unified, textDecoration: 'none'}}
      {...props}
    />
  )
}
