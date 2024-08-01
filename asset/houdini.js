/// <reference lib="dom" />

/* eslint-env browser */

if ('paintWorklet' in CSS) {
  // @ts-expect-error: CSS is not yet fully typed.
  CSS.paintWorklet.addModule('https://esm.sh/css-houdini-squircle@0.3?bundle')
}
