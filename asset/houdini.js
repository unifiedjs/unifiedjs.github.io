/// <reference lib="dom" />

/* eslint-env browser */
if ('paintWorklet' in CSS) {
  // @ts-expect-error: CSS is not yet fully typed.
  CSS.paintWorklet.addModule(
    // To do: update.
    'https://www.unpkg.com/css-houdini-squircle@0.1.5/squircle.min.js'
  )
}
