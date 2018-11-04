import React from 'react'
import {Link} from 'gatsby'

export default ({href, ...props}) => <Link to={href} {...props} />
