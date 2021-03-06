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

gulp.task("scss", function () {
    gulp.src("src/scss/main.scss")
        .pipe(sass({
            outputStyle: "compressed",
            includePaths: ["node_modules/normalize-scss/sass"]
        }))
        .pipe(autoprefixer({
            browsers: ["last 20 versions"]
        }))
        .pipe(rename("main.min.css"))
        .pipe(gulp.dest("dist"))
        .pipe(bs.stream());
});

gulp.task("bundle", function () {
    browserify({
            entries: "src/js/main.js",
            debug: true
        }).transform(babelify, { presets: ["@babel/preset-env"]})
        .bundle()
        .pipe(source("main.min.js"))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(uglify())
        .pipe(sourcemaps.write("./"))
        .pipe(gulp.dest("dist"))
});

gulp.task('serve', ['scss', 'bundle'], function () {

    bs.init({
        server: "./"
    });

    gulp.watch("src/scss/**/*", ['scss']);
    gulp.watch("src/js/*.js", ['bundle'])
    gulp.watch(["index.html", "dist/main.min.js"]).on("change", bs.reload);
});


gulp.task("default", ["serve"]);