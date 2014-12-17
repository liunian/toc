/**
 * Created by bd on 12/15/14.
 */
var gulp = require('gulp'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  replace = require('gulp-replace')

var fs = require('fs')

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
    .pipe(uglify())
    .pipe(gulp.dest('dist/'))
})

gulp.task('default', ['toc'])
