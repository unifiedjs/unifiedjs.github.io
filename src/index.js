/* global document */

var inView = require('in-view')

document.body.addEventListener('click', onclick)

when('.terminal', terminal)

windows()

when('.move', enter)

function enter($node) {
  $node.classList.remove('move')
  $node.classList.add('enter')
}

function terminal($terminal) {
  var $pre = $terminal.lastElementChild
  var $cmd = $pre.firstElementChild
  var $out = $pre.lastElementChild
  var $text = $cmd.childNodes[0]
  var cmd = $text.data
  var length = cmd.length
  var $caret
  var index = 0

  if ($terminal.dataset.animate === 'no') {
    return
  }

  if ($out === $cmd) {
    $out = null
  }

  $caret = document.createElement('span')
  $caret.textContent = '_'
  $caret.className = 'caret'
  $cmd.append($caret)

  $text.data = ''

  if ($out) {
    $out.style.visibility = 'hidden'
  }

  queue()

  function done() {
    var $line = document.createElement('div')

    $line.className = 'command'
    $caret.className += ' blink'
    $line.append($caret)

    if (!$pre.classList.contains('no-final-prompt')) {
      $pre.append($line)
    }

    if ($out) {
      $out.style.visibility = ''
    }
  }

  function one(char) {
    $text.data += char
  }

  function tick() {
    if (index === length) {
      $cmd.removeChild($caret)
      if ($cmd.classList.contains('delay-output')) {
        delay()
      } else {
        complete()
      }

      return
    }

    one(cmd.charAt(index))
    index++
    queue()
  }

  function complete() {
    setTimeout(done, time() * 3)
  }

  function delay() {
    var $spinner = document.createElement('span')
    var frames = '⠾⠷⠯⠟⠻⠽'.split('')
    var index = -1
    var length = frames.length * 6

    $spinner.className = 'spinner'
    $pre.insertBefore($spinner, $out)

    tock()

    function tock() {
      if (index > length) {
        $pre.removeChild($spinner)
        complete()
      } else {
        $spinner.textContent = '\n' + frames[++index % frames.length]
        setTimeout(tock, time())
      }
    }
  }

  function queue() {
    setTimeout(tick, time())
  }

  function time() {
    return 30 + Math.random() * 70
  }
}

function when(selector, cb) {
  var seen = []

  inView(selector).on('enter', onenter)

  function onenter($node) {
    if (!seen.includes($node)) {
      seen.push($node)
      cb($node)
    }
  }
}

function windows() {
  var buttons = ['close', 'minimize', 'fullscreen']
  var $nodes = document.querySelectorAll('.window')
  var length = $nodes.length
  var index = -1
  var $node
  var $caption
  var $button
  var $title
  var offset
  var count

  while (++index < length) {
    $node = $nodes[index]
    $caption = $node.querySelector('figcaption')

    $title = document.createElement('span')
    $title.className = 'chrome title'

    while ($caption.firstChild) {
      $title.append($caption.firstChild)
    }

    offset = -1
    count = buttons.length

    while (++offset < count) {
      $button = document.createElement('span')
      $button.className = 'chrome button ' + buttons[offset]
      $caption.append($button)
    }

    $caption.append($title)
  }
}

function onclick(ev) {
  var target = ev.target

  if (
    target.classList.contains('chrome') &&
    target.classList.contains('button') &&
    target.classList.contains('close')
  ) {
    prevent()
  }
}

function prevent() {
  var index = -1
  var messages = [
    'Are you sure?',
    'Are you really sure?',
    'No but really, are you sure?',
    'You can’t 🙃\n\nEnjoy your day though!'
  ]

  bug()

  function bug() {
    var message = messages[++index]

    /* global confirm */
    /* eslint-disable-next-line no-alert */
    if (message && confirm(message)) {
      bug()
    }
  }
}
