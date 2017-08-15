"use-strict";
var gulp = require("gulp");
var gulpsequence = require("gulp-sequence");
var argv = require("yargs").argv;//remove if not in use
var rename = require("gulp-rename");
var merge = require("merge-stream");
var concat = require("gulp-concat");
var uglify = require("gulp-uglify");
var merge = require("merge-stream");
var sass = require("gulp-sass");
var postcss = require("gulp-postcss");
var cachebuster = require("postcss-cachebuster");
var autoprefixer = require("autoprefixer");
var sourcemaps = require("gulp-sourcemaps");
var changed = require("gulp-changed");
var minify = require("gulp-minify");
var del = require("del");

const config = require("./gulpfile.config-clewie")();

gulp.task("watch", function () {
    gulp.watch(config.scriptssource, ["scripts"]);
    gulp.watch(config.styles.sourcefolder + "**/*.scss", ["styles"]);
});

gulp.task("scripts", function () {
    return merge(config.scripts.map(function (item) {
        return gulp.src(item.source)
            .pipe(sourcemaps.init())
            .pipe(concat(item.build))
            .pipe(sourcemaps.write())
            .pipe(gulp.dest(config.scriptsbuild));
    }));
});

gulp.task("styles", function (callback) {
    gulpsequence("sass")(callback);
});

gulp.task("sass", function () {
    return gulp.src(config.styles.source)
        .pipe(sourcemaps.init())
        .pipe(changed(config.styles.build))
        .pipe(sass.sync().on("error", sass.logError))
        .pipe(postcss([autoprefixer({ browsers: config.browsersupport }), cachebuster(),]))
        .pipe(rename(function (opt) {
            opt.basename = opt.basename.replace(/\-(clewie)/, "");
            return opt;
        }))
        .pipe(sourcemaps.write("./"))
        .pipe(gulp.dest(config.styles.build));
});

gulp.task("clean", ["clean:styles", "clean:scripts"]);

gulp.task("clean:styles", function () {
    return del([
        config.styles.build,
    ]);
});

gulp.task("clean:scripts", function () {
    return del(config.scriptsbuild);
});
