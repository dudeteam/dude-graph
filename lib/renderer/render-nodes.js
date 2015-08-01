/**
 * This method will update all nodes and their parents if needed
 * @param d3Nodes {d3.selection}
 * @private
 */
cg.Renderer.prototype._updateSelectedD3Nodes = function (d3Nodes) {
    var renderer = this;
    var updateParents = [];
    d3Nodes.each(function (rendererNode) {
        updateParents = updateParents.concat(renderer._getRendererNodeParents(rendererNode));
    });
    d3Nodes.attr("transform", function (rendererNode) {
        return "translate(" + rendererNode.position + ")";
    });
    if (updateParents.length > 0) {
        this._updateSelectedD3Groups(this._getD3NodesFromRendererNodes(updateParents));
    }
};