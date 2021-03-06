import assert from 'stream-assert'
import gulp   from 'gulp'
import expect from 'expect'
import subset from '../src/gulp-fontsubset'

describe('gulp-fontsubset', () => {

  describe('font only', () => {

    it('should return a TTF if given single TTF', done => {
      gulp.src([__dirname + '/fixtures/testFont1.ttf']) // length = 4584, 10 chars
        .pipe(subset({ text: 'ab' }))
        .pipe(assert.length(1))
        .pipe(assert.first(file => expect(file.path).toBe(__dirname + '/fixtures/testFont1.ttf')))
        .pipe(assert.first(file => expect(file[0].contents.length).toBeLessThan(4584 - 1000))) // saving 1000 bytes might be reasonable
        .pipe(assert.end(done))
    })

    it('should return all TTFs if given several TTF', done => {
      gulp.src([
        __dirname + '/fixtures/testFont1.ttf',  // length = 4584, 10 chars
        __dirname + '/fixtures/testFont2.ttf', // length = 4584, 10 chars. simple copy of testFont1.ttf
      ])
        .pipe(subset({ text: 'ab' }))
        .pipe(assert.length(2))
        .pipe(assert.first(file => expect(file.path).toBe(__dirname + '/fixtures/testFont1.ttf')))
        .pipe(assert.first(file => expect(file[0].contents.length).toBeLessThan(4584 - 1000))) // saving 1000 bytes might be reasonable
        .pipe(assert.end(done))
    })
  })

  describe('with html', () => {
    it('should return a ttf if given a ttf and html', done => {
      gulp.src([
        __dirname + '/fixtures/testFont1.ttf', // length = 4584, 10 chars
        __dirname + '/fixtures/test1.html' // 5 chars
      ])
        .pipe(subset())
        .pipe(assert.length(1))
        .pipe(assert.first(file => expect(file.path).toBe(__dirname + '/fixtures/testFont1.ttf')))
        .pipe(assert.first(file => expect(file[0].contents.length).toBeLessThan(4584 - 500))) // saving 500 bytes might be reasonable
        .pipe(assert.end(done))
    })

    it('should not depends on stream order.', done => {
      gulp.src([
        __dirname + '/fixtures/test1.html', // 5 chars
        __dirname + '/fixtures/testFont1.ttf', // length = 4584, 10 chars
      ])
      .pipe(subset())
      .pipe(assert.length(1))
      .pipe(assert.first(file => expect(file.path).toBe(__dirname + '/fixtures/testFont1.ttf')))
      .pipe(assert.first(file => expect(file[0].contents.length).toBeLessThan(4584 - 500))) // saving 500 bytes might be reasonable
      .pipe(assert.end(done))
    })

    it('should return a ttf if given a ttf and several html', done => {
      gulp.src([
        __dirname + '/fixtures/testFont1.ttf', // length = 4584, 10 chars
        __dirname + '/fixtures/test1.html', // 5 chars
        __dirname + '/fixtures/test2.html' // 3 chars
      ])
        .pipe(subset())
        .pipe(assert.length(1))
        .pipe(assert.first(file => expect(file.path).toBe(__dirname + '/fixtures/testFont1.ttf')))
        .pipe(assert.first(file => expect(file[0].contents.length).toBeLessThan(4584 - 250))) // saving 250 bytes might be reasonable
        .pipe(assert.end(done))
    })
  })

  describe('with css', () => {
    it('should return a ttf if given a ttf and a css', done => {
      gulp.src([
        __dirname + '/fixtures/testFont1.ttf', // length = 4584, 10 chars
        __dirname + '/fixtures/test1.css' // 3 chars
      ])
        .pipe(subset())
        .pipe(assert.length(1))
        .pipe(assert.first(file => expect(file.path).toBe(__dirname + '/fixtures/testFont1.ttf')))
        .pipe(assert.first(file => expect(file[0].contents.length).toBeLessThan(4584 - 1500))) // saving 1500 bytes might be reasonable
        .pipe(assert.end(done))
    })
  })

  describe('custom file recognition', () => {
    it('should argue pattern option.', done => {
      gulp.src([
        __dirname + '/fixtures/test._html', // 5 chars
        __dirname + '/fixtures/testFont._ttf', // length = 4584, 10 chars
      ])
      .pipe(subset({ pattern: { html: /^.+\._html$/, font: /^.+\._ttf$/ } }))
      .pipe(assert.length(1))
      .pipe(assert.first(file => expect(file.path).toBe(__dirname + '/fixtures/testFont.ttf')))
      .pipe(assert.first(file => expect(file[0].contents.length).toBeLessThan(4584 - 500))) // saving 500 bytes might be reasonable
      .pipe(assert.end(done))
    })
  })

  describe('format option', () => {
    it('should argue formats option', done => {
      gulp.src([
        __dirname + '/fixtures/test1.html', // 5 chars
        __dirname + '/fixtures/testFont1.ttf', // length = 4584, 10 chars
      ])
      .pipe(subset({ formats: ['eot', 'ttf', 'svg', 'woff'] }))
      .pipe(assert.length(4))
      .pipe(assert.nth(0, file => expect(file.path).toBe(__dirname + '/fixtures/testFont1.eot')))
      .pipe(assert.nth(1, file => expect(file.path).toBe(__dirname + '/fixtures/testFont1.ttf')))
      .pipe(assert.nth(2, file => expect(file.path).toBe(__dirname + '/fixtures/testFont1.svg')))
      .pipe(assert.nth(3, file => expect(file.path).toBe(__dirname + '/fixtures/testFont1.woff')))
      .pipe(assert.end(done))
    })

    it('should return nothing with invalid formats', done => {
      gulp.src([
        __dirname + '/fixtures/test1.html', // 5 chars
        __dirname + '/fixtures/testFont1.ttf', // length = 4584, 10 chars
      ])
      .pipe(subset({ formats: ['invalid', 'fontfile', 'format', 'given'] }))
      .pipe(assert.length(0))
      .pipe(assert.end(done))
    })
  })

  describe('test of custom presets', () => {
    it('should be effective', done => {
      gulp.src([__dirname + '/fixtures/testFont1.ttf']) // length = 4584, 10 chars
        .pipe(subset({ presets: [() => 'a'] })) // 1 char
        .pipe(assert.length(1))
        .pipe(assert.first(file => expect(file[0].contents.length).toBeLessThan(4584 - 2500))) // saving 2500 bytes might be reasonable
        .pipe(assert.end(done))
    })
  })
})
