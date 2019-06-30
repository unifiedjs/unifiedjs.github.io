var path = require('path')
var glob = require('glob')
var mkdirp = require('mkdirp')
var async = require('async')
var trough = require('trough')
var vfile = require('to-vfile')
var reporter = require('vfile-reporter')
var pack = require('../package.json')
var processors = require('./process')
var externals = require('./externals')

var filePipeline = trough()
  .use(vfile.read)
  .use(function(file, next) {
    var ext = file.extname

    if (ext in processors) {
      processors[ext]().process(file, function(err) {
        file.extname = processors[ext].extname
        file.processed = true
        next(err)
      })
    } else if (ext in externals) {
      externals[ext].run(file, function(err) {
        file.processed = true
        next(err)
      })
    } else {
      next()
    }
  })
  .use(function(file) {
    var sep = path.sep
    var paths = file.dirname.split(sep)
    paths[0] = 'build'
    file.dirname = paths.join(sep)
  })
  .use(function(file, next) {
    mkdirp(file.dirname, function(err) {
      next(err)
    })
  })
  .use(function(file, next) {
    return vfile.write(file, file.processed ? 'utf8' : 'binary', next)
  })
  .use(function(file) {
    file.stored = true
    console.error(reporter(file))
  })

trough()
  .use(glob)
  .use(function(paths, done) {
    return async.map(paths, filePipeline.run, done)
  })
  .use(function(files, next) {
    var contents = new URL(pack.homepage).host + '\n'
    vfile.write({dirname: 'build', basename: 'CNAME', contents: contents}, next)
  })
  .run('src/**/*.*', function(err) {
    if (err) {
      console.error(err)
      process.exitCode = 1
    }
  })
