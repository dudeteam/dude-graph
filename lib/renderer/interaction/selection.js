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

/**
 * Select all the renderNodes
 * @param {Boolean} [ignoreBlocks=false] - Whether to not select all blocks
 * @param {Boolean} [ignoreGroups=false] - Whether to not select all groups
 */
dudeGraph.Renderer.prototype.selectAll = function (ignoreBlocks, ignoreGroups) {
    this.clearSelection();
    if (!ignoreBlocks) {
        this.addToSelection(this._renderBlocks);
    }
    if (!ignoreGroups) {
        this.addToSelection(this._renderGroups);
    }
};

/**
 * Removes the selected renderNodes
 */
dudeGraph.Renderer.prototype.removeSelection = function () {
    var renderer = this;
    _.forEach(this._selectedRenderNodes, function (renderNode) {
        if (renderNode instanceof dudeGraph.RenderBlock) {
            renderer.removeRenderBlock(renderNode, true);
        } else {
            renderer.removeRenderGroup(renderNode, true);
        }
    });
    this.clearSelection();
};

/**
 * Creates a renderGroup for the selection
 * @param {String} name
 * @returns {dudeGraph.RenderGroup}
 */
dudeGraph.Renderer.prototype.createRenderGroupForSelection = function (name) {
    var renderGroup = this.createRenderGroup({
        "id": dudeGraph.uuid(),
        "description": name
    });
    _.forEach(this._selectedRenderNodes, function (renderNode) {
        renderNode.renderGroupParent = renderGroup;
    });
    this.createD3Groups();
    return renderGroup;
};