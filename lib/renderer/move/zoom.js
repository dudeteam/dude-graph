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
 * @param {[[Number, Number], [Number, Number]]} rect
 * @private
 */
dudeGraph.Renderer.prototype._zoomToBoundingRect = function (rect) {
    var svgBBox = this._d3Svg.node().getBoundingClientRect();
    var scaleExtent = this._zoomBehavior.scaleExtent();
    var dx = rect[0][1] - rect[0][0];
    var dy = rect[1][1] - rect[0][1];
    var x = (rect[0][0] + rect[1][0]) / 2;
    var y = (rect[0][1] + rect[1][1]) / 2;
    this._zoom.scale = _.clamp(0.9 / Math.max(dx / svgBBox.width, dy / svgBBox.height), scaleExtent[0], scaleExtent[1]);
    this._zoom.translate = [svgBBox.width / 2 - this._zoom.scale * x, svgBBox.height / 2 - this._zoom.scale * y];
    this._updateZoom();
};