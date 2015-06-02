/**
 * Enable zoom.
 * @private
 */
cg.Renderer.prototype._renderZoom = function() {
    this._zoom = d3.behavior.zoom()
        .scaleExtent([this._config.zoom.minZoom, this._config.zoom.maxZoom])
        .on('zoom', function () {
            if (d3.event.sourceEvent) {
                pandora.preventCallback(d3.event.sourceEvent);
            }
            this._rootGroup.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
            this._graph.zoom.translate = this._zoom.translate();
            this._graph.zoom.scale = this._zoom.scale();
        }.bind(this));
    this._graph.on("zoom", function () {
        this._zoom.translate(this._graph.zoom.translate);
        this._zoom.scale(this._graph.zoom.scale);
        this._svg.call(this._zoom.event);
    }.bind(this));
    this._graph.emit("zoom"); // apply the zoom at least once
    this._svg.call(this._zoom);
};