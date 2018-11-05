import React from 'react'
import {Link} from 'gatsby'
import {theme} from 'unified-ui'
import {urls} from '../names'
import {Logo} from './Logo'

export const Anchor = ({href, ...props}) => {
  const {children} = props
  let contents = href in urls ? urls[href] : []

  if (typeof contents === 'string') {
    contents = [contents]
  }

  if (contents.indexOf(children) !== -1) {
    return (
      <a href={href} style={{color: theme.colors.blue, textDecoration: 'none'}}>
        <Logo highlightOnHover name={children} {...props} />
      </a>
    )
  }

  return (
    <Link
      to={href}
      style={{color: theme.colors.unified, textDecoration: 'none'}}
      {...props}
    />
  )
}
