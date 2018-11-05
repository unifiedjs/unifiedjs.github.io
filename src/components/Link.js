import React from 'react'
import {Link} from 'gatsby'

export default ({href, ...props}) => {
  if (/^\/(?!\/)/.test(href)) {
    return <Link to={href} {...props} />
  }

  return <a href={href} {...props} />
}
