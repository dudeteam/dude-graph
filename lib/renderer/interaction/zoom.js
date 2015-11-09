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
                d3.event.sourceEvent.preventDefault();
            }
            renderer._d3Root.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
            renderer._zoom.translate = renderer._zoomBehavior.translate();
            renderer._zoom.scale = renderer._zoomBehavior.scale();
        }.bind(this));
    this._d3Svg.call(this._zoomBehavior);
    this._d3Svg
        .transition()
        .duration(this._config.zoom.transitionSpeed)
        .call(this._zoomBehavior.translate(this._zoom.translate).scale(this._zoom.scale).event);
};

/**
 * Zoom to best fit the given bounding box
 * @param {Object} boundingBox
 * @param {Number} boundingBox.x
 * @param {Number} boundingBox.y
 * @param {Number} boundingBox.width
 * @param {Number} boundingBox.height
 * @private
 */
dudeGraph.Renderer.prototype._zoomToBoundingBox = function (boundingBox) {
    var svgBBox = this._d3Svg.node().getBoundingClientRect();
    var scaleExtent = this._zoomBehavior.scaleExtent();
    var dx = boundingBox.width - boundingBox.x;
    var dy = boundingBox.height - boundingBox.y;
    var x = (boundingBox.x + boundingBox.width) / 2;
    var y = (boundingBox.y + boundingBox.height) / 2;
    var scale = dudeGraph.Math.clamp(0.9 / Math.max(dx / svgBBox.width, dy / svgBBox.height), scaleExtent[0], scaleExtent[1]);
    var translate = [svgBBox.width / 2 - scale * x, svgBBox.height / 2 - scale * y];
    this._d3Svg
        .transition()
        .duration(this._config.zoom.transitionSpeed)
        .call(this._zoomBehavior.translate(translate).scale(scale).event);
};