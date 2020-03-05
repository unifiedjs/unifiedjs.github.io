var fs = require('fs')
var path = require('path')
var {promisify} = require('util')
var glob = require('glob')
var sharp = require('sharp')
var pAll = require('p-all')
var mkdirp = require('vfile-mkdirp')
var trough = require('trough')
var vfile = require('to-vfile')
var reporter = require('vfile-reporter')
var browserify = require('browserify')
var postcss = require('postcss')
var postcssPresetEnv = require('postcss-preset-env')
var cssnano = require('cssnano')
var pack = require('../package.json')

require('dotenv').config()

var externals = {
  '.css': trough().use(transformCss),
  '.js': trough().use(bundleJs)
}

if (process.env.UNIFIED_OPTIMIZE_IMAGES) {
  externals['.png'] = trough().use(transformPng)
} else {
  console.log(
    'Not optimizing images: set `UNIFIED_OPTIMIZE_IMAGES=1` to turn on'
  )
}

var processPipeline = trough()
  .use(vfile.read)
  .use(processFile)
  .use(move)
  .use(mkdir)
  .use(vfile.write)

var copyPipeline = trough()
  .use(move)
  .use(mkdir)
  .use(copy)

var imagePipeline = trough()
  .use(move)
  .use(mkdir)
  .use(vfile.write)
  .use(print)

var filePipeline = trough()
  .use(function(fp, next) {
    var file = vfile(fp)
    var ext = file.extname
    var pipeline = ext in externals ? processPipeline : copyPipeline
    pipeline.run(file, next)
  })
  .use(print)

trough()
  .use(glob)
  .use(function(paths, done) {
    var run = promisify(filePipeline.run)

    pAll(
      paths.map(path => () => run(path)),
      {concurrency: 3}
    ).then(files => done(null, files), done)
  })
  .use(function(files, next) {
    var contents = new URL(pack.homepage).host + '\n'
    vfile.write({dirname: 'build', basename: 'CNAME', contents: contents}, next)
  })
  .run('asset/**/*.*', function(err) {
    if (err) {
      process.exitCode = 1
    }
  })

function processFile(file, next) {
  externals[file.extname].run(file, function(err) {
    file.processed = true
    next(err)
  })
}

function move(file) {
  var sep = path.sep
  file.dirname = ['build'].concat(file.dirname.split(sep).slice(1)).join(sep)
}

function mkdir(file, next) {
  mkdirp(file, done)
  function done(err) {
    next(err)
  }
}

function copy(file, next) {
  fs.copyFile(file.history[0], file.path, done)
  function done(err) {
    next(err)
  }
}

function print(file) {
  file.stored = true

  // Clear memory.
  file.contents = null
  console.error(reporter(file))
}

function transformCss(file) {
  return postcss(postcssPresetEnv({stage: 0}), cssnano({preset: 'advanced'}))
    .process(file.toString('utf8'), {from: file.path})
    .then(function(result) {
      file.contents = result.css
    })
}

function bundleJs(file, next) {
  browserify(file.path)
    .plugin('tinyify')
    .bundle(done)

  function done(err, buf) {
    if (buf) {
      file.contents = String(buf)
    }

    next(err)
  }
}

function transformPng(file, next) {
  var sizes = [200, 600, 1200, 2000]
  var formats = ['webp', 'png']
  var options = {
    webp: {quality: 50, alphaQuality: 50},
    png: {quality: 50, compressionLevel: 9}
  }

  var run = promisify(imagePipeline.run)
  var pipeline = sharp(file.contents)

  pipeline
    .metadata()
    .then(metadata =>
      pAll(
        sizes
          .flatMap(size => formats.map(format => ({size, format})))
          .filter(d => d.size <= metadata.width)
          .map(file => () => one(file).then(d => run(d))),
        {concurrency: 3}
      )
    )
    .then(() => next(null, file), next)

  function one(media) {
    return pipeline
      .clone()
      .resize(media.size)
      [media.format](options[media.format])
      .toBuffer()
      .then(buf => {
        var copy = vfile(file.path)

        copy.contents = buf
        copy.stem += '-' + media.size
        copy.extname = '.' + media.format

        return copy
      })
  }
}
