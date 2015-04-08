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
    "graph/utils/container.js",
    "graph/utils/graph-error.js",
    "graph/models/model.js",
    "graph/models/action.js",
    "graph/models/getter.js",
    "graph/models/picker.js",
    "graph/entities/point.js",
    "graph/entities/connection.js",
    "graph/entities/entity.js",
    "graph/entities/group.js",
    "graph/entities/block.js",
    "graph/entities/graph.js",
    "renderer/renderer.js",
    "renderer/utils/renderer-collision.js",
    "renderer/utils/renderer-d3.js",
    "renderer/utils/renderer-error.js",
    "renderer/utils/renderer-point.js",
    "renderer/utils/renderer-position.js",
    "renderer/render/render.js",
    "renderer/render/render-point.js",
    "renderer/render/render-connection.js",
    "renderer/render/render-group.js",
    "renderer/render/render-block.js",
    "renderer/render/render-picker.js",
    "renderer/render/render-zoom.js",
    "renderer/render/render-drag.js",
    "renderer/render/render-selection.js",
    "serialization/json-loader.js",
    "serialization/json-saver.js"
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