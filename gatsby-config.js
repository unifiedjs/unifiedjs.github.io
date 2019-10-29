const ui = require('unified-ui')
const {name, description, keywords, homepage} = require('./package.json')

require('dotenv').config()

module.exports = {
  siteMetadata: {
    title: name,
    siteUrl: homepage,
    description,
    keywords
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name,
        short_name: name,
        start_url: '/',
        background_color: ui.theme.colors[name],
        theme_color: ui.theme.colors[name],
        display: 'minimal-ui'
      }
    },
    {
      resolve: 'gatsby-plugin-mdx',
      options: {
        extensions: ['.mdx', '.md'],
        defaultLayouts: {
          default: require.resolve('./src/components/Layout.js')
        }
      }
    },
    {
      resolve: 'gatsby-source-graphql',
      options: {
        typeName: 'GitHub',
        fieldName: 'github',
        url: 'https://api.github.com/graphql',
        headers: {
          Authorization: `bearer ${process.env.GITHUB_TOKEN}`
        }
      }
    },
    'gatsby-plugin-offline'
  ]
}
