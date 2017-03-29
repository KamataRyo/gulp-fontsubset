# gulp-fontsubset

[![Build Status](https://travis-ci.org/KamataRyo/gulp-fontsubset.svg?branch=master)](https://travis-ci.org/KamataRyo/gulp-fontsubset)

gulp-fontsubset is a gulp plugin to generate subsets of ttf fonts.

## install

```
$ npm install -D gulp-fontsubset
```

## usage

### Static import

```
import gulp from 'gulp'
import subset from 'gulp-fontsubset'

gulp.task('subset', () => {
  gulp.src([
    'path/to/the.ttf',
    'path/to/the.html'
  ])
    .pipe(subset({ opts }))
    .pipe(gulp.dest('dist/'))
})
```

### CommonJS style

```
const gulp = require('gulp')
const subset = require('gulp-fontsubset')

gulp.task('subset', () => {
  gulp.src([
    'path/to/the.ttf',
    'path/to/the.html'
  ])
    .pipe(subset({ opts }))
    .pipe(gulp.dest('dist/'))
})
```

## options

|key|type|default|description|
|:--|:--|:--|:--|
|text|string|`''`|the including texts for subsetting|
|pattern|object|`{ html: /^.+\.html$/, font: /^.+\.ttf$/ }`|file recognition patterns.|
|formats|array|`['ttf']`|export formats. Any combinations of `ttf, eot, svg, woff` are avairable.|
|presets|array|`['html']`|Any combination of string `html, css, fontAwesome` and function|
