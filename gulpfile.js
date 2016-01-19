var gulp = require("gulp");
var concat = require("gulp-concat");
var uglify = require("gulp-uglify");
var jshint = require("gulp-jshint");
var plumber = require("gulp-plumber");
var notify = require("gulp-notify");
var shell = require("gulp-shell");
var jsdoc = require("gulp-jsdoc3");
var sourcemaps = require("gulp-sourcemaps");

var SOURCES = [
    "lib/index.js",
    "lib/utils/*.js",
    "lib/graph/graph.js",
    "lib/graph/block.js",
    "lib/graph/point.js",
    "lib/graph/connection.js",
    "lib/graph/points/*.js",
    "lib/graph/blocks/*.js",
    "lib/graph/**/*.js",
    "lib/renderer/renderer.js",
    "lib/renderer/*.js",
    "lib/renderer/nodes/node.js",
    "lib/renderer/nodes/*.js",
    "lib/renderer/**/*.js",
    "lib/default.js"
];

gulp.task("jsdoc", function () {
    return gulp.src(SOURCES)
        .pipe(jsdoc({
            "opts": {
                "destination": "documentation"
            },
            "plugins": [
                "plugins/markdown"
            ]
        }));
});

gulp.task("jshint", function () {
    return gulp.src(SOURCES)
        .pipe(plumber())
        .pipe(jshint())
        .pipe(jshint.reporter())
        .pipe(jshint.reporter("fail"))
        .on("error", notify.onError(function (error) {
            return error.message;
        }));
});

gulp.task("build", ["jshint"], function () {
    return gulp.src(SOURCES)
        .pipe(concat("dude-graph.js"))
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest("."));
});

gulp.task("watch", ["build"], function () {
    gulp.watch(SOURCES, ["jshint", "build"]);
});

gulp.task("serve", ["watch"], shell.task("polyserve"));

gulp.task("default", ["serve"]);