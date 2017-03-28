// snipet for inner implement


gulp.task('font', () => {
  gulp.src([
    './node_modules/FontAwesome/fonts/**/*.woff2',
    './node_modules/slick-carousel/slick/fonts/**/*.+(woff|woff2|svg|eot|ttf)',
  ])
    .pipe(gulp.dest('./dist/fonts'))

  const input = new Fontmin().src('./node_modules/font-awesome/fonts/**/*.ttf')
    .use(Fontmin.glyph({
      text: config.FontAwesome.includes
        .map(x => String.fromCharCode(parseInt('0x' + x)))
        .join('')
    }))
  const dist = './dist/fonts'

  input.dest(dist).run()
  input.use(Fontmin.ttf2eot()).dest(dist).run()
  input.use(Fontmin.ttf2woff({ deflate: true })).dest(dist).run()
  input.use(Fontmin.ttf2svg()).dest(dist).run()
})
