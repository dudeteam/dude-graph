/**
 * Creates zoom and pan
 * @private
 */
dudeGraph.Renderer.prototype._createZoomBehavior = function () {
    var renderer = this;
    this._zoom = d3.behavior.zoom()
        .scaleExtent([this._config.zoom.min, this._config.zoom.max])
        .on("zoom", function () {
            if (d3.event.sourceEvent) {
                d3.event.sourceEvent.preventDefault();
            }
            renderer._d3Root.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
            renderer._config.zoom.translate = renderer._zoom.translate();
            renderer._config.zoom.scale = renderer._zoom.scale();
        }.bind(this));
    this._d3Svg.call(this._zoom);
    this._d3Svg
        .transition()
        .duration(this._config.zoom.transitionSpeed)
        .call(this._zoom.translate(this._config.zoom.translate).scale(this._config.zoom.scale).event);
};

/**
 * Zoom to best fit all rendererNodes
 * @private
 */
dudeGraph.Renderer.prototype._zoomToFit = function () {
    var svgBBox = this._d3Svg.node().getBoundingClientRect();
    var rootBBox = this._getBBox(this._d3Root.node());
    var scaleExtent = this._zoom.scaleExtent();
    var dx = rootBBox.width - rootBBox.x;
    var dy = rootBBox.height - rootBBox.y;
    var x = (rootBBox.x + rootBBox.width) / 2;
    var y = (rootBBox.y + rootBBox.height) / 2;
    var scale = dudeGraph.Math.clamp(0.9 / Math.max(dx / svgBBox.width, dy / svgBBox.height), scaleExtent[0], scaleExtent[1]);
    var translate = [svgBBox.width / 2 - scale * x, svgBBox.height / 2 - scale * y];
    this._d3Svg
        .transition()
        .duration(this._config.zoom.transitionSpeed)
        .call(this._zoom.translate(translate).scale(scale).event);
};