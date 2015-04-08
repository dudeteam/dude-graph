var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');

var paths = {
    "lib": "./lib/",
    "dist": "."
};

var sources = [
    "index.js",
    "graph/utils/graph-error.js",
    "graph/nodes/entity.js",
    "graph/utils/container.js",
    "graph/nodes/group.js",
    "graph/nodes/point.js",
    "graph/models/model.js",
    "graph/models/getter.js",
    "graph/models/picker.js",
    "graph/models/action.js",
    "graph/nodes/block.js",
    "graph/nodes/connection.js",
    "graph/nodes/graph.js",
    "renderer/renderer.js",
    "renderer/utils/renderer-d3.js",
    "renderer/utils/renderer-error.js",
    "renderer/utils/renderer-position.js",
    "renderer/utils/renderer-point.js",
    "renderer/utils/renderer-collision.js",
    "renderer/render/render.js",
    "renderer/render/render-selection.js",
    "renderer/render/render-zoom.js",
    "renderer/render/render-drag.js",
    "renderer/render/render-block.js",
    "renderer/render/render-picker.js",
    "renderer/render/render-group.js",
    "renderer/render/render-connection.js",
    "renderer/render/render-point.js",
    "serialization/json-saver.js",
    "serialization/json-loader.js"
];

gulp.task('watch', function () {
    gulp.watch(sources.map(function (e) {
        return paths.lib + e;
    }), ['build']);
});

gulp.task('build', function () {
    return gulp.src(sources.map(function (e) {
        return paths.lib + e;
    }))
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(concat("codegraph.js"))
        //.pipe(uglify({mangle: false}))
        .pipe(gulp.dest(paths.dist));
});

gulp.task('library', ['build', 'watch']);