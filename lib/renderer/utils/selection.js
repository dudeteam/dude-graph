/**
 * Returns an unique HTML usable id for the given rendererNode
 * @param {dudeGraph.RendererNode} rendererNode
 * @param {Boolean?} sharp - True to include the sharp to select, False otherwise
 * @return {String}
 * @private
 */
dudeGraph.Renderer.prototype._getRendererNodeUniqueID = function (rendererNode, sharp) {
    return pandora.formatString("{0}cg-{1}-{2}", sharp ? "#" : "", rendererNode.type, rendererNode.id);
};

/**
 * Returns a selection of d3Nodes from rendererNodes
 * @param {Array<dudeGraph.RendererNode>} rendererNodes
 * @returns {d3.selection}
 * @private
 */
dudeGraph.Renderer.prototype._getD3NodesFromRendererNodes = function (rendererNodes) {
    var groupedSelectionIds = d3.set();
    pandora.forEach(rendererNodes, function (rendererNode) {
        groupedSelectionIds.add(this._getRendererNodeUniqueID(rendererNode, true));
    }.bind(this));
    return this._d3Root.selectAll(groupedSelectionIds.values().join(", "));
};

/**
 * Moves the d3 selection nodes to the top front of their respective parents
 * @param {d3.selection} d3Selection
 * @returns {d3.selection}
 * @private
 */
dudeGraph.Renderer.prototype._d3MoveToFront = function (d3Selection) {
    return d3Selection.each(function () {
        this.parentNode.appendChild(this);
    });
};