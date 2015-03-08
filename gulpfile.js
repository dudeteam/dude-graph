var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');

/**
 * Uglify the Javascript code.
 * @type {boolean}
 */
var doUglify = false;

var paths = {
    "lib": "./lib/",
    "dist": "./dist/"
};

var sources = [
    "index.js",
    "utils/vec2.js",
    "utils/box2.js",
    "utils/event-emitter.js",
    "utils/misc.js",
    "utils/graph-error.js",
    "nodes/node.js",
    "nodes/container.js",
    "nodes/group.js",
    "nodes/point.js",
    "nodes/model.js",
    "nodes/models/getter.js",
    "nodes/models/picker.js",
    "nodes/models/action.js",
    "nodes/block.js",
    "nodes/connection.js",
    "nodes/graph.js",
    "renderer/index.js",
    "renderer/cursor-point.js",
    "renderer/utils.js",
    "renderer/pickers.js",
    "renderer/zoom.js",
    "renderer/background-grid.js",
    "renderer/render-graph.js",
    "renderer/render-container.js",
    "renderer/render-group.js",
    "renderer/render-block.js",
    "renderer/render-point.js",
    "renderer/render-connection.js",
    "serialization/json-saver.js",
    "serialization/json-loader.js"
];

gulp.task('default', function() {
    return gulp.src(sources.map(function(e) { return paths.lib + e; }))
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(uglify())
        .pipe(concat("codegraph.min.js"))
        .pipe(gulp.dest(paths.dist));
});