/**
 * Enable selection.
 * @private
 */
cg.Renderer.prototype._renderZoom = function() {
    this._svg.call(d3.behavior.zoom()
            .on('zoom', function () {
                pandora.preventCallback(d3.event.sourceEvent);
                this._rootGroup.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
            }.bind(this))
    );
};