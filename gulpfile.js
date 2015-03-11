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
    "graph/utils/graph-error.js",
    "graph/nodes/node.js",
    "graph/utils/container.js",
    "graph/models/model.js",
    "graph/models/getter.js",
    "graph/models/picker.js",
    "graph/models/action.js",
    "graph/nodes/group.js",
    "graph/nodes/point.js",
    "graph/nodes/block.js",
    "graph/nodes/connection.js",
    "graph/nodes/graph.js",
    "renderer/renderer-error.js",
    "renderer/index.js",
    "renderer/cursor-point.js",
    "renderer/utils.js",
    "renderer/pickers.js",
    "renderer/zoom.js",
    "renderer/grid.js",
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
        .pipe(concat("codegraph.min.js"))
        .pipe(uglify({mangle: false}))
        .pipe(gulp.dest(paths.dist));
});