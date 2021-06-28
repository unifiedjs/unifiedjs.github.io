import {header} from '../molecule/header.js'
import {footer} from '../molecule/footer.js'

export default function rehypeWrap() {
  return transform

  function transform(tree) {
    tree.children.unshift(header())
    tree.children.push(footer())
  }
}
