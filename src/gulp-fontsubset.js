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
    text: text ? text : '', // store given text string
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

    Promise.all(params.map(({ format, font }) => new Promise((resolve, reject) => {
      const input = new Fontmin().src(font.contents) // as buffer

      let middle
      switch (format) {
        case 'eot':
          middle = input.use(Fontmin.ttf2eot())
          break
        case 'svg':
          middle = input.use(Fontmin.ttf2svg())
          break
        case 'woff':
          middle = input.use(Fontmin.ttf2woff())
          break
        case 'ttf':
          middle = input
      }

      middle
        .use(Fontmin.glyph({ text: store.text }))
        .run((err, font) => {
          if (err) {
            reject()
          } else {
            const { dir, name } = path.parse(store.fonts[0].path)
            font.path = `${dir}/${name}.${format}`
            resolve(font)
          }
        })

    })))
      .then(fonts => {
        fonts.forEach(font => this.push(font))
        callback()
      })
      .catch(err => console.log(err))
  }

  return through.obj(transform, flush)
}
