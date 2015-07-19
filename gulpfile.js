var gulp = require("gulp");
var concat = require("gulp-concat");
var uglify = require("gulp-uglify");
var jshint = require("gulp-jshint");
var mocha = require('gulp-mocha');

var CG_SOURCES = [
    "lib/index.js",
    "lib/graph/utils/*.js",
    "lib/serialization/*.js",
    "lib/graph/graph.js",
    "lib/graph/block.js",
    "lib/graph/point.js",
    "lib/graph/connection.js",
    "lib/graph/blocks/*.js",
    "lib/graph/points/*.js"
];

gulp.task("jshint", function () {
    return gulp.src(CG_SOURCES)
        .pipe(jshint())
        .pipe(jshint.reporter());
});

gulp.task("build", ["jshint"], function () {
    return gulp.src(["./bower_components/pandora/lib/pandora.js"].concat(CG_SOURCES))
        .pipe(concat("codegraph.js"))
        //.pipe(uglify())
        .pipe(gulp.dest("."));
});

gulp.task("watch", ["build"], function () {
    gulp.watch(CG_SOURCES, ["jshint", "build"]);
});

gulp.task("test", ["build"], function () {
    return gulp.src(['test/*.js', 'tests/**/*.js'], {read: false})
        .pipe(mocha({reporter: 'spec'}));
});

gulp.task("default", ["watch"]);