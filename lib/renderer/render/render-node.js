/**
 * This method will update all nodes and their parents if needed
 * @param d3Nodes {d3.selection}
 * @private
 */
cg.Renderer.prototype._updateSelectedD3Nodes = function (d3Nodes) {
    var renderer = this;
    var updateParents = [];
    // TODO: Optimize this to only compute needed groups position and size
    this._computeRendererGroupsPositionAndSize();
    d3Nodes
        .attr("transform", function (rendererNode) {
            updateParents = updateParents.concat(renderer._getRendererNodeParents(rendererNode));
            return "translate(" + rendererNode.position + ")";
        });
    if (updateParents.length > 0) {
        this._updateSelectedD3Groups(this._getD3NodesFromRendererNodes(updateParents));
    }
    // TODO: Optimize this to only update the needed connections
    this._updatedD3Connections();
};