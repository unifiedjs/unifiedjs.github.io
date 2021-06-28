import fs from 'fs'
import path from 'path'
import {promisify} from 'util'
import glob from 'glob'
import sharp from 'sharp'
import pAll from 'p-all'
import {mkdirp} from 'vfile-mkdirp'
import {trough} from 'trough'
import {toVFile} from 'to-vfile'
import {reporter} from 'vfile-reporter'
import esbuild from 'esbuild'
import postcss from 'postcss'
import postcssPresetEnv from 'postcss-preset-env'
import cssnano from 'cssnano'
import dotenv from 'dotenv'

const pack = JSON.parse(fs.readFileSync('package.json'))

dotenv.config()

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
  .use(toVFile.read)
  .use(processFile)
  .use(move)
  .use(mkdir)
  .use(toVFile.write)

var copyPipeline = trough().use(move).use(mkdir).use(copy)

var imagePipeline = trough().use(move).use(mkdir).use(toVFile.write).use(print)

var filePipeline = trough()
  .use(function (fp, next) {
    var file = toVFile(fp)
    var ext = file.extname
    var pipeline = ext in externals ? processPipeline : copyPipeline
    pipeline.run(file, next)
  })
  .use(print)

trough()
  .use(glob)
  .use(function (paths, done) {
    var run = promisify(filePipeline.run)

    pAll(
      paths.map((path) => () => run(path)),
      {concurrency: 3}
    ).then((files) => done(null, files), done)
  })
  .use(function (files, next) {
    var value = new URL(pack.homepage).host + '\n'
    toVFile.write({dirname: 'build', basename: 'CNAME', value}, next)
  })
  .run('asset/**/*.*', function (error) {
    if (error) {
      console.error(reporter(error))
      process.exitCode = 1
    }
  })

function processFile(file, next) {
  externals[file.extname].run(file, function (error) {
    file.processed = true
    next(error)
  })
}

function move(file) {
  var sep = path.sep
  file.dirname = ['build'].concat(file.dirname.split(sep).slice(1)).join(sep)
}

function mkdir(file, next) {
  mkdirp(file, done)
  function done(error) {
    next(error)
  }
}

function copy(file, next) {
  fs.copyFile(file.history[0], file.path, done)
  function done(error) {
    next(error)
  }
}

function print(file) {
  file.stored = true
  // Clear memory.
  file.value = null
  console.error(reporter(file))
}

function transformCss(file) {
  return postcss(postcssPresetEnv({stage: 0}), cssnano({preset: 'advanced'}))
    .process(file.toString('utf8'), {from: file.path})
    .then(function (result) {
      file.value = result.css
    })
}

function bundleJs(file, next) {
  esbuild
    .build({
      entryPoints: [file.path],
      bundle: true,
      minify: true,
      write: false
    })
    .then(function (result) {
      if (result.errors.length > 0) throw new Error('esbuild errors')
      if (result.warnings.length > 0) throw new Error('esbuild warnings')
      const output = result.outputFiles[0]
      file.value = output.contents
      next()
    }, next)
}

function transformPng(file, next) {
  var sizes = [200, 600, 1200, 2000]
  var formats = ['webp', 'png']
  var options = {
    webp: {quality: 50, alphaQuality: 50},
    png: {quality: 50, compressionLevel: 9}
  }

  var run = promisify(imagePipeline.run)
  var pipeline = sharp(file.value)

  pipeline
    .metadata()
    .then((metadata) =>
      pAll(
        sizes
          .flatMap((size) => formats.map((format) => ({size, format})))
          .filter((d) => d.size <= metadata.width)
          .map((file) => () => one(file).then((d) => run(d))),
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
      .then((buf) => {
        var copy = toVFile(file.path)

        copy.value = buf
        copy.stem += '-' + media.size
        copy.extname = '.' + media.format

        return copy
      })
  }
}
