/**
 * Updates all d3Nodes
 * @private
 */
dudeGraph.Renderer.prototype._updateD3Nodes = function () {
    this._updateD3Blocks();
    this._updateD3Groups();
    this._updateD3Connections();
};

/**
 * Updates the given d3Nodes and their parents if needed
 * @param {d3.selection} d3Nodes
 * @private
 */
dudeGraph.Renderer.prototype._updateSelectedD3Nodes = function (d3Nodes) {
    var renderer = this;
    var updateRendererBlocks = [];
    var updateRendererGroups = [];
    var updateRendererGroupParents = [];
    d3Nodes
        .each(function (rendererNode) {
            updateRendererGroupParents = updateRendererGroupParents.concat(renderer._getRendererNodeParents(rendererNode));
            if (rendererNode.type === "block") {
                updateRendererBlocks.push(rendererNode);
            } else if (rendererNode.type === "group") {
                updateRendererGroups.push(rendererNode);
            }
        });
    if (updateRendererBlocks.length > 0) {
        this._updateSelectedD3Blocks(this._getD3NodesFromRendererNodes(updateRendererBlocks));
    }
    if (updateRendererGroups.length > 0) {
        this._updateSelectedD3Groups(this._getD3NodesFromRendererNodes(updateRendererGroups));
    }
    if (updateRendererGroupParents.length > 0) {
        this._updateSelectedD3Groups(this._getD3NodesFromRendererNodes(updateRendererGroupParents));
    }
    // TODO: Optimize this to only update the needed connections
    this._updateD3Connections();
};