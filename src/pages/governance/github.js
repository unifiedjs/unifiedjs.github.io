import {graphql} from 'gatsby'

export {default} from '../../components/GitHubMDXRenderer'

export const query = () => graphql`
  query UnifiedjsGovernanceGitHub {
    github {
      repository(owner: "unifiedjs", name: "governance") {
        object(expression: "master:github.md") {
          ... on GitHub_Blob {
            text
          }
        }
      }
    }
  }
`
