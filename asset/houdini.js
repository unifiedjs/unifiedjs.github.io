/* eslint-env browser */
if ('paintWorklet' in CSS) {
  CSS.paintWorklet.addModule(
    'https://www.unpkg.com/css-houdini-squircle@0.1.5/squircle.min.js'
  )
}
