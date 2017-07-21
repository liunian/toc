/**
 * Created by bd on 12/15/14.
 */
const gulp = require('gulp'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  replace = require('gulp-replace'),
  rename = require('gulp-rename'),
  mirror = require('gulp-mirror'),
  pipe = require('multipipe'),
  del = require('del'),
  wrap = require("gulp-wrap")
  fs = require('fs')

const pkg = require('./package.json')

gulp.task('clean', function() {
  return del([
    'dist/**'
  ])
})

gulp.task('toc', function() {
  var cssPath = 'src/toc.css'
  var cssTexts = ''
  if (fs.existsSync(cssPath)) {
    cssTexts = fs.readFileSync(cssPath).toString()
    cssTexts = cssTexts.replace(/\n|\s+(?=\{)/g, '')  // line-break and space before {
      .replace(/\{\s+/g, '{')
      .replace(/:\s+/g, ':')
      .replace(/;\s+/g, ';')
  }

  gulp.src(['src/Chapter.js', 'src/Toc.js', 'src/index.js'])
    .pipe(concat('toc.js'))
    .pipe(replace(/@css@/g, cssTexts))
    .pipe(mirror(
      rename('toc.js'),
      pipe(
        rename('toc.min.js'),
        uglify()
      ),
      pipe(
        rename('toc.user.js'),
        wrap({ src: 'userScript.tpl' }, pkg)
      )
    ))
    .pipe(gulp.dest('dist/'))

  // var sourceStream = gulp.src(['src/Chapter.js', 'src/Toc.js', 'src/index.js'])
  //   .pipe(concat('toc.js'))
  //   .pipe(replace(/@css@/g, cssTexts))

  // sourceStream
  //   .pipe(new PassThrough())
  //   .pipe(rename('toc.user.js'))
  //   .pipe(gulp.dest('dist'))

  // sourceStream
  //   .pipe(new PassThrough())
  //   .pipe(gulp.dest('dist/'))

  // sourceStream
  //   .pipe(new PassThrough())
  //   .pipe(uglify())
  //   .pipe(rename('toc.min.js'))
  //   .pipe(gulp.dest('dist/'))

})

gulp.task('default', ['clean', 'toc'])
