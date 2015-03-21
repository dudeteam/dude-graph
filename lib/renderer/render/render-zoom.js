/**
 * Enable zoom.
 * @private
 */
cg.Renderer.prototype._renderZoom = function() {
    this._zoom = d3.behavior.zoom()
        .scaleExtent([this._config.zoom.minZoom, this._config.zoom.maxZoom])
        .on('zoom', function () {
            pandora.preventCallback(d3.event.sourceEvent);
            this._rootGroup.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
        }.bind(this));
    this._svg.call(this._zoom);
};