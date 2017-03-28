/**
 * Gulp plugin to convert xlsx files into csv files.
 * @file
 */

import through  from 'through2'
import path     from 'path'
import html2txt from 'html2txt'
import Fontmin  from 'fontmin'

/**
 * array filter callback to make it unique
 * @param  {object} x   each element
 * @param  {number} i   index
 * @param  {array} self the array
 * @return {array}      new unique array
 */
const unique = (x, i, self) => i == self.indexOf(x)

/**
 * wnew csv2json
 * @return {Stream} [description]
 */
export default function() {

  const EXT = {
    html: '.html',
    font: 'ttf',
  }
  const store = {
    texts: [],
    fonts: []
  }

  /**
   * Transform
   * @param  {Vinyl}    file     [description]
   * @param  {string}   encode   [description]
   * @param  {Function} callback [description]
   * @return {void}
   */
  function transform(file, encode, callback) {

    let result

    switch (path.etname(file.path)) {
      case EXT.html:
        result = file.clone()
        result.contents = new Buffer(html2txt(file.contents.toString().filter(unique())))
        store.texts.push(result)
        break
      case EXT.font:
        store.fonts.push(file)
        break
    }
    return callback()
  }

  /**
   * Flush
   * @param  {Function} callback [description]
   * @return {void}
   */
  function flush(callback) {

    let counter = 0

    new Fontmin()
      .src(store.fonts.map(x => x.contents))
      .use(Fontmin.glyph({
        text: store.texts.length > 0 ? store.text.join('').filter(unique()) : ''
      }))
      .run((err, files) => files.forEach(x => {
        this.push(x)
        if (counter == files.length) {
          callback()
        } else {
          counter++
        }
      }))
  }

  return through.obj(transform, flush)
}
