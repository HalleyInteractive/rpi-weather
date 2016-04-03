const gulp = require('gulp');
const jscs = require('gulp-jscs');

gulp.task('jscs', () => {
  return gulp.src('./project/*.js')
    .pipe(jscs())
    .pipe(jscs.reporter());
});

gulp.task('jscs-fix', () => {
  return gulp.src('./project/*.js')
    .pipe(jscs({ fix: true }))
    .pipe(jscs.reporter())
    .pipe(gulp.dest('./'));
});

gulp.task('test-jscs', () => {
  return gulp.src('./project/*.js')
    .pipe(jscs())
    .pipe(jscs.reporter())
    .pipe(jscs.reporter('fail'));
});
