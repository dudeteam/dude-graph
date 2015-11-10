/**
 * Adds the given renderNodes to the current selection
 * @param {Array<dudeGraph.RenderNode>} renderNodes - The renderNodes to add to the selection
 * @private
 */
dudeGraph.Renderer.prototype._addSelection = function (renderNodes) {
    var renderer = this;
    _.forEach(renderNodes, function (renderNode) {
        if (!_.includes(renderer._selectedRenderNodes, renderNode)) {
            renderNode.select();
            renderNode.d3Node.classed("dude-graph-selected", true);
            renderer._selectedRenderNodes.push(renderNode);
        }
    });
};

/**
 * Removes the given renderNodes from the current selection
 * @param {Array<dudeGraph.RenderNode>} renderNodes - The renderNodes to remove from the selection
 * @private
 */
dudeGraph.Renderer.prototype._removeSelection = function (renderNodes) {
    var renderer = this;
    _.forEach(renderNodes, function (renderNode) {
        if (_.includes(renderer._selectedRenderNodes, renderNode)) {
            renderNode.unselect();
            renderNode.d3Node.classed("dude-graph-selected", false);
            _.pull(renderer._selectedRenderNodes, renderNode);
        }
    });
};

/**
 * Clears the selection
 * @private
 */
dudeGraph.Renderer.prototype._clearSelection = function () {
    this._removeSelection(this._selectedRenderNodes);
};