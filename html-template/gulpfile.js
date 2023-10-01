const gulp = require("gulp");
const pug = require("gulp-pug");

function compilePug(){
  //入力ファイルの選択　（_からはじまるファイルは入力対象から除外
  return gulp.src(["./src/**/*.pug","!./src/**/_*.pug"])
  //　コンパイルの処理
  .pipe(pug({
    pretty: true
  }))
  //出力ファイルのパス
  .pipe(gulp.dest("./public"))
}

function watch(){
  gulp.watch(["./src/**/*.pug","!./src/**/_*.pug"], compilePug);
}

exports.compilePug = compilePug;
exports.watch = watch;
