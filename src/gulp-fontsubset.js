/**
 * Gulp plugin to convert xlsx files into csv files.
 * @file
 */

import through  from 'through2'
import Fontmin  from 'fontmin'

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
        .replace(/<([^>]+)>/ig, '\n') // strip leftover tags
        .replace(/\n\s*\n/g, '\n\n')  // collapse multiple newlines
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
    Promise.all(FORMATS.map(format => new Promise((resolve, reject) => {
      store.fonts.forEach(font => {
        new Fontmin()
          .src(font.contents) // input as a buffer
          .use(Fontmin.glyph({ text: store.text }))
          .run((err, font) => {
            if (err) {
              reject()
            } else {
              font.path = store.fonts[0].path
              this.push(font)
              resolve()
            }
          })
      })

    })
  ))
    .then(() => {
      callback()
    })
    .catch(err => console.log(err))
  }

  return through.obj(transform, flush)
}
