const gulp = require('gulp');
const jscs = require('gulp-jscs');

gulp.task('jscs', () => {
    return gulp.src('*.js')
        .pipe(jscs())
        .pipe(jscs.reporter());
});
