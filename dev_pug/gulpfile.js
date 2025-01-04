const gulp = require("gulp");	//gulpの読み込み

const htmlBeautify = require("gulp-html-beautify");	//HTMLフォーマット
const sass = require("gulp-sass")(require("sass"));	//Sassコンパイル
const postcss = require("gulp-postcss");	//PostCSS
const autoprefixer = require("autoprefixer");	//ベンダープレフィックス付与
const cssSorter = require("css-declaration-sorter");	//CSSソート
const mmq = require("gulp-merge-media-queries");	//media queryをまとめる
const cleanCss = require("gulp-clean-css");	//CSS圧縮
const rename = require("gulp-rename");	//ファイル名変更
const uglify = require("gulp-uglify");	//JS圧縮
const gulpIf = require("gulp-if");	//条件分岐
const gulpIgnore = require("gulp-ignore");	//ファイル除外
const pug = require("gulp-pug");	//Pug

const browserSync = require("browser-sync");	//ブラウザ自動リロード

/*===============================
Pug
===============================*/
function compilePug(){
	return gulp.src(["./src/**/*.pug"], ["!./src/**/_*.pug"])
	.pipe(pug({pretty:true}))
	.pipe(gulp.dest("./public"))
}

/*===============================
html
===============================*/
//gulp-html-beautifyのオプション設定(コメント未記載のオプションは、デフォルト値のまま)
const htmlBeautyOption = {
	"indent_size": 2, //インデントのサイズ
	"indent_char": " ",
	"eol": "\n",
	"indent_level": 0,
	"indent_with_tabs": true, //true:インデントをタグにする
	"preserve_newlines": true,
	"max_preserve_newlines": 10,
	"jslint_happy": false,
	"space_after_anon_function": false,
	"brace_style": "collapse",
	"keep_array_indentation": false,
	"keep_function_indentation": false,
	"space_before_conditional": true,
	"break_chained_methods": false,
	"eval_code": false,
	"unescape_strings": false,
	"wrap_line_length": 0,
	"wrap_attributes": "auto",
	"wrap_attributes_indent_size": 4,
	"end_with_newline": false
};

//srcディレクトリのHTMLをフォーマット
function formatHTML(){
	return gulp.src("./src/**/*.html")	//入力ファイル
	.pipe(htmlBeautify(htmlBeautyOption))
	.pipe(gulp.dest("./src/"));	//出力先
}
exports.formatHTML = formatHTML;


//publicにHTMLをコピー
function copyHTML(){
	return gulp.src("./src/**/*.html")	//入力ファイル
	// .pipe(htmlBeautify(htmlBeautyOption)) //HTMLをフォーマット
	.pipe(gulp.dest("./public/"));	//出力先
}
exports.copyHTML = copyHTML;

/*===============================
SASSコピー
===============================*/
function copySass(){
	return gulp.src("./src/assets/sass/**/*.scss")	//入力ファイル
	.pipe(gulp.dest("./public/assets/sass"));	//sassコピー
}
exports.copySass = copySass;

/*===============================
CSS生成
===============================*/
function compileSass(){
	return gulp.src("./src/assets/sass/**/*.scss")	//入力ファイル
	.pipe(sass())	//dart-sassでコンパイル
	.pipe(postcss([	//Sass差し替え
		autoprefixer(),	//ベンダープレフィックス付与
		cssSorter({order:"concentric-css"}), //cssソート
	]))
	// .pipe(mmq())	//media queryをまとめる
	.pipe(gulp.dest("./public/assets/css"))	//圧縮前CSS出力
	.pipe(cleanCss())
	.pipe(rename({
		suffix: ".min"
	}))
	.pipe(gulp.dest("./public/assets/css"));	//min.css出力
}
exports.compileSass = compileSass;

/*===============================
サードパーティCSSコピー
===============================*/
function copyCSS(){
	return gulp.src("./src/assets/css/**/*")
	.pipe(gulp.dest("./public/assets/css"));
}


/*===============================
jsコピー & min.js生成
===============================*/
//jsをコピー（.minも生成）
function copyJS(){
	return gulp.src("./src/assets/js/**/*.js")
	.pipe(gulp.dest("./public/assets/js"))//圧縮前JS出力
	.pipe(gulpIgnore.exclude("**/*.min.js")) //.min.jsは以降の処理を行わない
	.pipe(uglify())	//JS圧縮
	.pipe(rename({	//.min.jsにリネーム
		suffix: ".min"
	}))
	.pipe(gulp.dest("./public/assets/js"));//min.js出力
}
exports.copyJS = copyJS;

/*===============================
画像コピー
===============================*/
function copyImg(){
	return gulp.src("./src/assets/img/**/*")
	.pipe(gulp.dest("./public/assets/img"));
}

/*===============================
フォントファイルコピー
===============================*/
function copyFonts(){
	return gulp.src("./src/assets/fonts/**/*")
	.pipe(gulp.dest("./public/assets/fonts"));
}

/*===============================
ブラウザ自動リロード
===============================*/
//ブラウザ立ち上げ
function browserInit(done){
	browserSync.init({
		server:{
			baseDir:"./public"
		}
	});
	done();
}

//立ち上げたブラウザの自動リロード
function browserReload(done){
	browserSync.reload();
	done();
}

/*===============================
タスク起動
===============================*/
//sassコンパイルの自動実行
function watch(){
	gulp.watch("./src/**/*.html", gulp.series(copyHTML));	//htmlファイルの監視
	gulp.watch("./src/assets/sass/**/*.scss", gulp.series(copySass, compileSass));	//scssファイルの監視
	gulp.watch("./src/assets/css/**/*.css", gulp.series(copyCSS,browserReload)); //cssファイルの監視
	gulp.watch("./src/assets/js/**/*.js", gulp.series(copyJS)); //jsファイルの監視
	gulp.watch("./src/assets/img/**/*", gulp.series(copyImg)); //imgファイルの監視
	gulp.watch("./src/assets/fonts/**/*", gulp.series(copyFonts)); //フォントファイルの監視
}

//sassコンパイルの自動実行 + ブラウザリロード
function watch2(){
	gulp.watch("./src/**/*.html", gulp.series(copyHTML, browserReload));	//htmlファイルの監視
	gulp.watch("./src/assets/sass/**/*.scss", gulp.series(copySass, compileSass, browserReload));	//scssファイルの監視
	gulp.watch("./src/assets/css/**/*.css", gulp.series(copyCSS,browserReload)); //cssファイルの監視
	gulp.watch("./src/assets/js/**/*.js", gulp.series(copyJS,browserReload)); //jsファイルの監視
	gulp.watch("./src/assets/img/**/*", gulp.series(copyImg, browserReload)); //imgファイルの監視
	gulp.watch("./src/assets/fonts/**/*", gulp.series(copyFonts, browserReload)); //フォントファイルの監視
}


/*===============================
ビルド
===============================*/
function buildAll(done){
	compilePug();
	copyHTML();
	copySass();
	compileSass();
	copyCSS();
	copyJS();
	copyImg();
	copyFonts();
	done();
}

/*===============================
タスク起動
===============================*/

exports.dev = gulp.parallel(buildAll, browserInit, watch);
exports.dev2 = gulp.parallel(buildAll, browserInit, watch2);

exports.build = buildAll;
