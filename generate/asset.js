/**
 * @import {PackageJson} from 'type-fest'
 */

import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import {glob} from 'glob'
import sharp from 'sharp'
import pAll from 'p-all'
import {mkdirp} from 'vfile-mkdirp'
import {VFile} from 'vfile'
import {read, write} from 'to-vfile'
import {reporter} from 'vfile-reporter'
import esbuild from 'esbuild'
import postcss from 'postcss'
import postcssPresetEnv from 'postcss-preset-env'
import cssnano from 'cssnano'
import dotenv from 'dotenv'

const packageValue = await fs.readFile('package.json', 'utf8')
/** @type {PackageJson} */
const packageJson = JSON.parse(packageValue)

dotenv.config()

const postCssProcessor = postcss(
  postcssPresetEnv({stage: 0}),
  cssnano({preset: 'advanced'})
)

/** @type {Record<string, (file: VFile) => Promise<Array<VFile> | VFile>>} */
const externals = {
  '.css': transformCss,
  '.js': transformJs
}

if (process.env.UNIFIED_OPTIMIZE_IMAGES) {
  externals['.png'] = transformPng
} else {
  console.log(
    'Not optimizing images: set `UNIFIED_OPTIMIZE_IMAGES=1` to turn on'
  )
}

const paths = await glob('asset/**/*.*')
/** @type {Array<() => Promise<undefined>>} */
const tasks = [
  ...paths.map(function (fp) {
    /**
     * @returns {Promise<undefined>}
     */
    return async function () {
      const file = new VFile({path: fp})
      const extname = file.extname

      if (extname && extname in externals) {
        const pipeline = externals[extname]
        const result = await pipeline(file)
        const files = Array.isArray(result) ? result : [result]
        for (const file of files) {
          assert(file.dirname)
          file.dirname = [
            'build',
            ...file.dirname.split(path.sep).slice(1)
          ].join(path.sep)
          await mkdirp(file)
          await write(file)
          file.stored = true
          console.error(reporter(file))
        }
      } else {
        assert(file.dirname)
        file.dirname = ['build', ...file.dirname.split(path.sep).slice(1)].join(
          path.sep
        )
        await mkdirp(file)
        await fs.copyFile(file.history[0], file.path)
        file.stored = true
        console.error(reporter(file))
      }
    }
  }),
  async function () {
    assert(typeof packageJson.homepage === 'string')
    const cname = new VFile({
      dirname: 'build',
      basename: 'CNAME',
      value: new URL(packageJson.homepage).host + '\n'
    })
    await write(cname)
    console.error(reporter(cname))
  }
]

await pAll(tasks, {concurrency: 5})

/**
 * @param {VFile} file
 * @returns {Promise<VFile>}
 */
async function transformCss(file) {
  await read(file)
  const result = await postCssProcessor.process(String(file), {from: file.path})
  file.value = result.css
  return file
}

/**
 * @param {VFile} file
 * @returns {Promise<VFile>}
 */
async function transformJs(file) {
  const result = await esbuild.build({
    entryPoints: [file.path],
    bundle: true,
    minify: true,
    write: false
  })

  const logs = await Promise.all([
    esbuild.formatMessages(result.errors, {kind: 'error'}),
    esbuild.formatMessages(result.warnings, {kind: 'warning'})
  ])
  const flatLogs = logs.flat()
  if (flatLogs.length > 0) {
    console.error(flatLogs.join('\n'))
  }

  assert.equal(result.outputFiles.length, 1)
  const output = result.outputFiles[0]
  file.value = output.contents
  return file
}

/**
 * @param {VFile} file
 * @returns {Promise<Array<VFile>>}
 */
async function transformPng(file) {
  // Note: see `rehype-pictures` for the inverse.
  const sizes = [200, 600, 1200, 2000]
  const options = {
    webp: {quality: 50, alphaQuality: 50},
    png: {quality: 50, compressionLevel: 9}
  }
  const formats = /** @type {Array<keyof typeof options>} */ (
    Object.keys(options)
  )

  await read(file)
  const sharpPipeline = sharp(file.value)
  const metadata = await sharpPipeline.metadata()
  assert(metadata.width)

  const files = [file]

  for (const size of sizes) {
    if (size > metadata.width) continue

    for (const format of formats) {
      const buf = await sharpPipeline
        .clone()
        .resize(size)
        [format](options[format])
        .toBuffer()

      const copy = new VFile({path: file.path, value: buf})

      copy.stem += '-' + size
      copy.extname = '.' + format
      files.push(copy)
    }
  }

  return files
}
