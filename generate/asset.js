import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import process from 'node:process'
import cssnano from 'cssnano'
import dotenv from 'dotenv'
import esbuild from 'esbuild'
import {glob} from 'glob'
import postcssPresetEnv from 'postcss-preset-env'
import postcss from 'postcss'
import sharp from 'sharp'
import {read, write} from 'to-vfile'
import {reporter} from 'vfile-reporter'
import {VFile} from 'vfile'

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

for (const fp of paths) {
  const file = new VFile({path: fp})
  const extname = file.extname

  if (extname && extname in externals) {
    const pipeline = externals[extname]
    const result = await pipeline(file)
    const files = Array.isArray(result) ? result : [result]
    for (const file of files) {
      assert(file.dirname)
      file.dirname = 'build' + file.dirname.replace(/^asset/, '')
      await fs.mkdir(file.dirname, {recursive: true})
      await write(file)
      file.stored = true
      console.error(reporter(file))
    }
  } else {
    assert(file.dirname)
    file.dirname = 'build/' + file.dirname.replace(/^asset\//, '')
    await fs.mkdir(file.dirname, {recursive: true})
    await fs.copyFile(file.history[0], file.path)
    file.stored = true
    console.error(reporter(file))
  }
}

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
    bundle: true,
    entryPoints: [file.path],
    minify: true,
    write: false
  })

  const logs = [
    ...(await esbuild.formatMessages(result.errors, {kind: 'error'})),
    ...(await esbuild.formatMessages(result.warnings, {kind: 'warning'}))
  ]

  if (logs.length > 0) {
    console.error(logs.join('\n'))
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
    png: {compressionLevel: 9, quality: 50},
    webp: {alphaQuality: 50, quality: 50}
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
