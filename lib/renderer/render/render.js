/**
 * Render the graph.
 * @private
 */
cg.Renderer.prototype._render = function() {
    this._renderGroups();
    this._renderBlocks();
    this._renderConnections();
};