/**
 * Creates zoom and pan
 * @private
 */
cg.Renderer.prototype._createZoomBehavior = function () {
    var renderer = this;
    this._zoom = d3.behavior.zoom()
        .scaleExtent([this._config.zoom.min, this._config.zoom.max])
        .on("zoom", function () {
            if (d3.event.sourceEvent) {
                pandora.preventCallback(d3.event.sourceEvent);
            }
            renderer._rootSvg.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
            renderer._config.zoom.translate = renderer._zoom.translate();
            renderer._config.zoom.scale = renderer._zoom.scale();
        }.bind(this));
    this._svg.call(this._zoom);
};