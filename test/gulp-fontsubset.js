import assert from 'stream-assert'
import gulp   from 'gulp'
import subset from '../src/gulp-fontsubset'
import { hasExtname } from './helpers/expect-vinyl'

describe('gulp-fontsubset', () => {

  it('should return null', done => {
    gulp.src('nomatch.file.name')
      .pipe(subset())
      .pipe(assert.length(0))
      .pipe(assert.end(done))
  })

  it('should return a ttf if given a ttf', done => {
    gulp.src(['fixtures/test1.ttf'])
      .pipe(subset())
      .pipe(assert.length(1))
      .pipe(assert.first(hasExtname('.ttf')))
      .pipe(assert.end(done))
  })

  it('should return a ttf if given a ttf and html', done => {
    gulp.src(['fixtures/test1.ttf', 'fixtures/test1.html'])
      .pipe(subset())
      .pipe(assert.length(1))
      .pipe(assert.first(hasExtname('.ttf')))
      .pipe(assert.end(done))
  })

  it('should be exchangeable.', done => {
    gulp.src(['fixtures/test1.html', 'fixtures/test1.ttf'])
      .pipe(subset())
      .pipe(assert.length(1))
      .pipe(assert.first(hasExtname('.ttf')))
      .pipe(assert.end(done))
  })
})
