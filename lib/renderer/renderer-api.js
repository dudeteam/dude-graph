//
// Copyright (c) 2015 DudeTeam. All rights reserved.
//

/**
 * Zooms to best fit all renderNodes
 */
dudeGraph.Renderer.prototype.zoomToFit = function () {
    this.zoomToFitRenderNodes(this._renderBlocks.concat(this._renderGroups));
};

/**
 * Zooms to best fit the selected renderNodes
 */
dudeGraph.Renderer.prototype.zoomToFitSelection = function () {
    this.zoomToFitRenderNodes(this._selectedRenderNodes);
};

/**
 * Zooms to best fit the given renderNodes
 * @param {Array<dudeGraph.RenderNode>} renderNodes
 */
dudeGraph.Renderer.prototype.zoomToFitRenderNodes = function (renderNodes) {
    if (!_.isEmpty(renderNodes)) {
        var boundingRect = this.renderNodesBoundingRect(renderNodes);
        this._zoomToBoundingBox({
            "x": boundingRect[0][0] - this._config.zoom.margin[0] / 2,
            "y": boundingRect[0][1] - this._config.zoom.margin[1] / 2,
            "width": boundingRect[1][0] + this._config.zoom.margin[0],
            "height": boundingRect[1][1] + this._config.zoom.margin[1]
        });
    }
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
 * Returns the selected renderNodes
 * @returns {Array<dudeGraph.RenderNode>}
 */
dudeGraph.Renderer.prototype.selection = function () {
    return this._selectedRenderNodes;
};

/**
 * Removes the selected renderNodes
 */
dudeGraph.Renderer.prototype.removeSelection = function () {
    var renderer = this;
    _.forEach(this._selectedRenderNodes, function (renderNode) {
        if (renderNode instanceof dudeGraph.RenderBlock) {
            renderer.removeRenderBlock(renderNode, true);
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
        "id": _.uuid(),
        "description": name
    });
    _.forEach(this._selectedRenderNodes, function (renderNode) {
        renderNode.nodeParent = renderGroup;
    });
    this.createD3Groups();
    return renderGroup;
};