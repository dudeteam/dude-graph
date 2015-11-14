/**
 * Adds the given renderNodes to the current selection
 * @param {Array<dudeGraph.RenderNode>} renderNodes - The renderNodes to add to the selection
 */
dudeGraph.Renderer.prototype.addToSelection = function (renderNodes) {
    var renderer = this;
    _.forEach(renderNodes, function (renderNode) {
        if (!_.includes(renderer._selectedRenderNodes, renderNode)) {
            renderNode.select();
            renderNode.d3Node.classed("dude-graph-selected", true);
            renderer._selectedRenderNodes.push(renderNode);
            renderer.emit("select", renderNode);
        }
    });
};

/**
 * Removes the given renderNodes from the current selection
 * @param {Array<dudeGraph.RenderNode>} renderNodes - The renderNodes to remove from the selection
 */
dudeGraph.Renderer.prototype.removeFromSelection = function (renderNodes) {
    var renderer = this;
    _.remove(this._selectedRenderNodes, function (selectedRenderNode) {
        if (_.includes(renderNodes, selectedRenderNode)) {
            selectedRenderNode.unselect();
            selectedRenderNode.d3Node.classed("dude-graph-selected", false);
            renderer.emit("unselect", selectedRenderNode);
            return true;
        }
        return false;
    });
};

/**
 * Clears the selection
 */
dudeGraph.Renderer.prototype.clearSelection = function () {
    this.removeFromSelection(this._selectedRenderNodes);
    this.emit("unselect-all");
};