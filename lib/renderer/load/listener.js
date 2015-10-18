/**
 * Initializes the listeners to automatically updates the renderer when a graph change occurs
 * @private
 */
dudeGraph.Renderer.prototype._initializeListeners = function () {
    var renderer = this;
    this._cgGraph.on("dude-graph-block-create", this.createRendererBlock.bind(this));
    this._cgGraph.on("dude-graph-block-name-change", function (cgBlock) {
        renderer._updateSelectedD3Blocks(renderer._getD3NodesFromRendererNodes(
            renderer._getRendererBlocksByCgBlock(cgBlock)));
        // TODO: Optimize
        renderer._updateSelectedD3Nodes(renderer._getD3NodesFromRendererNodes(
            renderer._getRendererBlocksByCgBlock(cgBlock)));
    });
    this._cgGraph.on("cg-point-value-change", function (cgPoint) {
        renderer._updateSelectedD3Blocks(renderer._getD3NodesFromRendererNodes(
            renderer._getRendererBlocksByCgBlock(cgPoint._cgBlock)));
    });
};