var gulp = require("gulp");
var concat = require("gulp-concat");
var uglify = require("gulp-uglify");
var jshint = require("gulp-jshint");
var shell = require("gulp-shell");

var CG_SOURCES = [
    "lib/index.js",
    "lib/utils/*.js",
    "lib/graph/graph.js",
    "lib/graph/block.js",
    "lib/graph/point.js",
    "lib/graph/connection.js",
    "lib/points/*.js",
    "lib/blocks/*.js",
    "lib/serialization/graph-saver.js",
    "lib/serialization/renderer-saver.js",
    "lib/serialization/json-saver.js",
    "lib/serialization/json-loader.js",
    "lib/renderer/renderer.js",
    "lib/renderer/*.js",
    "lib/renderer/**/*.js"
];

gulp.task("jshint", function () {
    return gulp.src(CG_SOURCES)
        .pipe(jshint())
        .pipe(jshint.reporter());
});

gulp.task("build", ["jshint"], function () {
    return gulp.src(["./bower_components/pandora/lib/pandora.js"].concat(CG_SOURCES))
        .pipe(concat("dude-graph.js"))
        //.pipe(uglify())
        .pipe(gulp.dest("."));
});

gulp.task("watch", ["build"], function () {
    gulp.watch(CG_SOURCES, ["jshint", "build"]);
});

gulp.task("serve", ["watch"], shell.task("polyserve"));

gulp.task("default", ["serve"]);