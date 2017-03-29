import File from 'vinyl'
import expect from 'expect'
import { BUILT_IN_PRESETS as PRESETS } from '../src/gulp-fontsubset'

/**
 * create new File context as Vinyl
 * @param  {string} contents content string of the file
 * @param  {string} extname  name of extension
 * @return {Vinyl}           vinyl object
 */
const createVinyl = (contents, extname) => new File({
  cwd: '/home/kamataryo/',
  base: '/home/kamataryo/',
  path: `/home/kamataryo/test.${extname}`,
  contents: new Buffer( contents ),
  stat: { mode: '0666' }
})

describe('test of html preset', () => {

  it('should extract innerText', () => {
    expect(PRESETS.html(createVinyl('<html>test<div /></html>')))
      .toBe('test')
  })
})

describe('test of css preset', () => {

  it('should extract content property', () => {
    expect(PRESETS.css(createVinyl('a{ content: "abc"; }'))).toBe('abc')
  })

  it('should extract content property', () => {
    expect(PRESETS.css(createVinyl('a::before{ content: \'abc\'; }'))).toBe('abc')
  })

  it('should extract several content property', () => {
    expect(PRESETS.css(createVinyl('a::before{ content: \'a\'; }a::after{ content: \'bc\'; }'))).toBe('abc')
  })
})
