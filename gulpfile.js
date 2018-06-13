var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var rename = require('gulp-rename');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var bs = require("browser-sync").create();
var babelify = require('babelify');

gulp.task('serve', ['scss'], function () {

    bs.init({
        server: "."
    });

    gulp.watch("scss/*/**", ['scss']);
    gulp.watch(["css/main.css", "index.html"]).on('change', bs.reload);
});


gulp.task("scss", function () {
    gulp.src("scss/main.scss")
        .pipe(sass({
            outputStyle: "compressed",
            errLogToConsole: true,
        }))
        .pipe(autoprefixer({
            browsers: ["last 20 versions"]
        }))
        .pipe(rename("main.min.css"))
        .pipe(gulp.dest("css/"));
});


gulp.task("js", function () {
    browserify({
            entries: "js/main.js",
            debug: true
        }).transform("babelify", { presets: ["@babel/preset-es2015"]})
        .bundle()
        .pipe(source("main.min.js"))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
            .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest("js/"))
});

gulp.task("default", ["serve"]);