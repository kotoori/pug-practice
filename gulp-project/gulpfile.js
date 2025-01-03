const gulp = require('gulp');
const pug = require('gulp-pug');

function compliePug() {
  return gulp.src(["./src/**/*.pug", "!./src/**/_*.pug"])
    .pipe(pug())
    .pipe(gulp.dest("./dist"));
}

exports.compilePug = compilePug;
