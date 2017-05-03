var path = require('path');
var glob = require('glob');
var bail = require('bail');
var async = require('async');
var trough = require('trough');
var vfile = require('to-vfile');
var reporter = require('vfile-reporter');
var processors = require('./process');
var externals = require('./externals');

var filePipeline = trough()
  .use(vfile.read)
  .use(function (file, next) {
    var ext = file.extname.slice(1);
    var processor = processors[ext];
    var external = externals[ext];

    if (processor) {
      processor().process(file, function (err) {
        file.extname = processor.extname;
        file.processed = true;
        next(err);
      });
    } else if (external) {
      external(file, function (err, contents) {
        file.contents = contents;
        file.processed = true;
        next(err);
      });
    } else {
      next();
    }
  })
  .use(function (file) {
    var sep = path.sep;
    file.dirname = file.dirname.split(sep).slice(1).join(sep);
  })
  .use(function (file, next) {
    return vfile.write(file, file.processed ? 'utf8' : 'binary', next);
  })
  .use(function (file) {
    file.stored = true;
    console.error(reporter(file));
  });

trough()
  .use(glob)
  .use(function (paths, done) {
    return async.map(paths, filePipeline.run, done);
  })
  .run('src/**/*.*', bail);
