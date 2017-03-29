/**
 * Gulp plugin to convert xlsx files into csv files.
 * @file
 */

import through from 'through2'
import Fontmin from 'fontmin'
import path    from 'path'

/**
 * wnew csv2json
 * @return {Stream} [description]
 */
export default function({ text, pattern, formats } = {}) {

  /**
   * store processing objects
   * @type {Object}
   */
  const store = {
    text: text ? text + '' : '', // store given text string
    fonts: []
  }

  const PATTERN_DEFAULT = {
    html: /^.+\.html$/,
    font: /^.+\.ttf$/,
  }
  const PATTERN = { ...PATTERN_DEFAULT, ...pattern }

  const FORMATS = formats ? formats : ['ttf']

  /**
   * Transform
   * @param  {Vinyl}    file     [description]
   * @param  {string}   encode   [description]
   * @param  {Function} callback [description]
   * @return {void}
   */
  function transform(file, encode, callback) {

    if (PATTERN.html.test(file.path)) {
      store.text += file.contents.toString()
        .replace(/<([^>]+)>/ig, '') // strip leftover tags
    } else if (PATTERN.font.test(file.path)) {
      store.fonts.push(file)
    }
    return callback()
  }

  /**
   * Flush
   * @param  {Function} callback [description]
   * @return {void}
   */
  function flush(callback) {

    // generate all combination
    const params = []
    FORMATS.forEach(format => store.fonts.forEach(font => params.push({ format, font })))

    // nothing to process
    if (params.length == 0) { return callback() }

    Promise.all(params.map(({ format, font }) => new Promise((resolve, reject) => {

      const input = new Fontmin().src(font.contents) // as buffer

      let presubset
      switch (format) {
        case 'eot':
          presubset = input.use(Fontmin.ttf2eot())
          break
        case 'svg':
          presubset = input.use(Fontmin.ttf2svg())
          break
        case 'woff':
          presubset = input.use(Fontmin.ttf2woff())
          break
        case 'ttf':
          presubset = input
          break
        default:
          presubset = null
      }

      presubset ? presubset
        .use(Fontmin.glyph({ text: store.text }))
        .run((err, font) => {
          if (err) {
            reject(err)
          } else {
            const { dir, name } = path.parse(store.fonts[0].path)
            font.path = `${dir}/${name}.${format}`
            resolve(font)
          }
        }) : resolve(null)

    })))
      .then(fonts => {
        fonts.forEach(font => font && this.push(font))
        callback()
      })
      .catch(err => {
        // TODO: replace with gulp-utils
        console.log(err)
        callback()
      })
  }

  return through.obj(transform, flush)
}
