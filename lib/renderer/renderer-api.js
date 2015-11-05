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
 * @param {Object} rendererData
 * @param {Array} rendererData.blocks
 * @param {Array} rendererData.groups
 * @param {Array} rendererData.connections
 */
dudeGraph.Renderer.prototype.load = function (cgGraph, rendererData) {
    this._load(cgGraph, rendererData);
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
    renderer._rendererBlockDragPositionBehavior(d3Block);
    return rendererBlock;
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
    this._zoomToFit();
};