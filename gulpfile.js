'use strict';
const jshint = require('gulp-jshint');
const gulp = require('gulp');

gulp.task('lint', function() {
    return gulp.src([
            './*.js',
            './tests/*.js'
    ])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});
