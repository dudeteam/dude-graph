/**
 * Render the graph.
 * @private
 */
cg.Renderer.prototype._render = function() {
    this._renderGroups(this.getGroups());
    this._renderBlocks(this.getBlocks());
    this._renderConnections(this.getConnections());
};