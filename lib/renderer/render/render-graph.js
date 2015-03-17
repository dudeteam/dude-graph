/**
 * Render the graph entity.
 * @param graph {cg.Graph}
 * @private
 */
cg.Renderer.prototype._renderGraph = function (graph) {
    this._render(graph.children);
    this._render(graph.connections);
};