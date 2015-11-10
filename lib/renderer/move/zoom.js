/**
 * Creates zoom and pan
 * @private
 */
dudeGraph.Renderer.prototype._createZoomBehavior = function () {
    var renderer = this;
    this._zoomBehavior = d3.behavior.zoom()
        .scaleExtent([this._config.zoom.min, this._config.zoom.max])
        .on("zoom", function () {
            if (d3.event.sourceEvent) {
                _.browserIf(["IE"], function () {
                    d3.event.sourceEvent.defaultPrevented = true;
                }, function () {
                    d3.event.sourceEvent.preventDefault();
                });
            }
            renderer._d3Root.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
            renderer._zoom.translate = renderer._zoomBehavior.translate();
            renderer._zoom.scale = renderer._zoomBehavior.scale();
        }.bind(this));
    this._d3Svg.call(this._zoomBehavior);
};

/**
 * Updates the zoom and pan location
 * @private
 */
dudeGraph.Renderer.prototype._updateZoom = function () {
    this._d3Svg
        .transition()
        .duration(this._config.zoom.transitionSpeed)
        .call(this._zoomBehavior.translate(this._zoom.translate).scale(this._zoom.scale).event);
};

/**
 * Zoom to best fit the given bounding box
 * @param {[[Number, Number], [Number, Number]]} boundingBox
 * @private
 */
dudeGraph.Renderer.prototype._zoomToBoundingBox = function (boundingBox) {
    var svgBBox = this._d3Svg.node().getBoundingClientRect();
    var scaleExtent = this._zoomBehavior.scaleExtent();
    var dx = boundingBox[0][1] - boundingBox[0][0];
    var dy = boundingBox[1][1] - boundingBox[0][1];
    var x = (boundingBox[0][0] + boundingBox[1][0]) / 2;
    var y = (boundingBox[0][1] + boundingBox[1][1]) / 2;
    this._zoom.scale = _.clamp(0.9 / Math.max(dx / svgBBox.width, dy / svgBBox.height), scaleExtent[0], scaleExtent[1]);
    this._zoom.translate = [svgBBox.width / 2 - this._zoom.scale * x, svgBBox.height / 2 - this._zoom.scale * y];
    this._updateZoom();
};