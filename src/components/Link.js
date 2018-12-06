import React from 'react'
import {Link} from 'gatsby'
import isUrl from 'is-url'

export default ({href, ...props}) => {
  if (isUrl(href)) {
    return <a href={href} {...props} />
  }

  if (/^\/(?!\/)/.test(href)) {
    return <Link to={href} {...props} />
  }

  return <a href={href} {...props} />
}
