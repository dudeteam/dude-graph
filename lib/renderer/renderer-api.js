/**
 * Saves the renderer
 * @returns {Object}
 */
dudeGraph.Renderer.prototype.save = function () {
    return this._save();
};

/**
 * Loads the renderer with the  cgGraph and the rendererData
 * @param {dudeGraph.Graph} cgGraph
 * @param {Object?} rendererData
 * @param {Object?} rendererConfig
 */
dudeGraph.Renderer.prototype.load = function (cgGraph, rendererData, rendererConfig) {
    this._load(cgGraph, rendererData, rendererConfig);
};

/**
 * Creates a rendererGroup from the current selection.
 * @returns {dudeGraph.RendererGroup}
 */
dudeGraph.Renderer.prototype.createRendererGroupFromSelection = function (name) {
    var renderer = this;
    var rendererNodes = this.d3Selection.data();
    var rendererGroup = this._createRendererGroup({
        "id": dudeGraph.UUID.generate(),
        "description": name
    });
    _.forEach(rendererNodes, function (rendererNode) {
        renderer._removeRendererNodeParent(rendererNode);
        renderer._addRendererNodeParent(rendererNode, rendererGroup);
    });
    this._createD3Groups();
    this._updateD3Groups();
    return rendererGroup;
};

/**
 * Creates a rendererBlock from the given cgBlock.
 * @param {dudeGraph.Block} cgBlock
 * @returns {dudeGraph.RendererBlock}
 */
dudeGraph.Renderer.prototype.createRendererBlock = function (cgBlock) {
    var renderer = this;
    var rendererBlock = renderer._createRendererBlock({
        "id": dudeGraph.UUID.generate(),
        "cgBlock": cgBlock.cgId,
        "position": [100, 100],
        "size": [100, 100]
    });
    renderer._createD3Blocks();
    var d3Block = renderer._getD3NodesFromRendererNodes([rendererBlock]);
    renderer._createMoveRendererBlockBehavior(d3Block);
    return rendererBlock;
};

/**
 * Select all the rendererNodes
 * @param {Boolean} ignoreBlocks - Whether to not select all blocks
 * @param {Boolean} ignoreGroups - Whether to not select all groups
 */
dudeGraph.Renderer.prototype.selectAll = function (ignoreBlocks, ignoreGroups) {
    this._clearSelection(true);
    if (!ignoreBlocks) {
        this._addToSelection(this.d3Blocks);
    }
    if (!ignoreGroups) {
        this._addToSelection(this.d3Groups);
    }
};

/**
 * Remove the current selection.
 */
dudeGraph.Renderer.prototype.removeSelection = function () {
    var renderer = this;
    _.forEach(this.d3Selection.data(), function (rendererNode) {
        renderer._removeRendererNode(rendererNode);
    });
    this._clearSelection();
    this._removeD3Blocks();
    this._removeD3Groups();
    this._removeD3Connections();
    this._updateD3Nodes();
};

/**
 * Zoom to best fit all rendererNodes
 */
dudeGraph.Renderer.prototype.zoomToFit = function () {
    var rootBBox = this._getBBox(this._d3Root.node());
    this._zoomToBoundingBox(rootBBox);
};

/**
 * Zoom to best fit the selected rendererNodes
 */
dudeGraph.Renderer.prototype.zoomToSelection = function () {
    if (!this.d3Selection.empty()) {
        var boundingBox = this._getRendererNodesBoundingBox(this.d3Selection.data());
        this._zoomToBoundingBox({
            "x": boundingBox[0][0] - this._config.zoom.margin[0] / 2,
            "y": boundingBox[0][1] - this._config.zoom.margin[1] / 2,
            "width": boundingBox[1][0] + this._config.zoom.margin[0],
            "height": boundingBox[1][1] + this._config.zoom.margin[1]
        });
    }
};