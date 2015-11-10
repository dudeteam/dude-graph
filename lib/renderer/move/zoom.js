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