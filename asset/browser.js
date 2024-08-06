/// <reference lib="dom" />

/* eslint-env browser */

import {computePosition, shift} from '@floating-ui/dom'

if ('paintWorklet' in CSS) {
  // @ts-expect-error: CSS is not yet fully typed.
  CSS.paintWorklet.addModule('https://esm.sh/css-houdini-squircle@0.3?bundle')
}

const popoverTargets = /** @type {Array<HTMLElement>} */ (
  Array.from(document.querySelectorAll('.rehype-twoslash-popover-target'))
)

for (const popoverTarget of popoverTargets) {
  /** @type {NodeJS.Timeout | number} */
  let timeout = 0

  popoverTarget.addEventListener('click', function () {
    popoverShow(popoverTarget)
  })

  popoverTarget.addEventListener('mouseenter', function () {
    clearTimeout(timeout)
    timeout = setTimeout(function () {
      popoverShow(popoverTarget)
    }, 300)
  })

  popoverTarget.addEventListener('mouseleave', function () {
    clearTimeout(timeout)
  })

  if (popoverTarget.classList.contains('rehype-twoslash-autoshow')) {
    popoverShow(popoverTarget)
  }
}

/**
 * @param {HTMLElement} popoverTarget
 *   Popover target.
 * @returns {undefined}
 *   Nothing.
 */
function popoverShow(popoverTarget) {
  const id = popoverTarget.dataset.popoverTarget
  if (!id) return
  const popover = document.getElementById(id)
  if (!popover) return

  popover.showPopover()

  computePosition(popoverTarget, popover, {
    placement: 'bottom',
    middleware: [shift({padding: 5})]
  }).then(
    /**
     * @param {{x: number, y: number}} value
     */
    function (value) {
      popover.style.left = value.x + 'px'
      popover.style.top = value.y + 'px'
    }
  )
}
