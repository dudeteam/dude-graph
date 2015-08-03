/**
 * Returns an unique HTML usable id for the given rendererNode
 * @param rendererNode {cg.RendererNode}
 * @param sharp {Boolean?} True to include the sharp to select, False otherwise
 * @return {String}
 * @private
 */
cg.Renderer.prototype._getRendererNodeUniqueID = function (rendererNode, sharp) {
    return pandora.formatString("{0}cg-{1}-{2}", sharp ? "#" : "", rendererNode.type, rendererNode.id);
};

/**
 * Returns a selection of d3Nodes from rendererNodes
 * @param rendererNodes {Array<cg.RendererNode>}
 * @returns {d3.selection}
 * @private
 */
cg.Renderer.prototype._getD3NodesFromRendererNodes = function (rendererNodes) {
    var groupedSelectionIds = d3.set();
    pandora.forEach(rendererNodes, function (rendererNode) {
        groupedSelectionIds.add(this._getRendererNodeUniqueID(rendererNode, true));
    }.bind(this));
    return d3.selectAll(groupedSelectionIds.values().join(", "));
};

/**
 * Moves the d3 selection nodes to the top front of their respective parents
 * @param d3Selection {d3.selection}
 * @returns {d3.selection}
 * @private
 */
cg.Renderer.prototype._d3MoveToFront = function (d3Selection) {
    return d3Selection.each(function () {
        this.parentNode.appendChild(this);
    });
};