/**
 * Returns the rendererNode associated with the given id
 * @param {String} id
 * @returns {dudeGraph.RendererBlock|null}
 * @private
 */
dudeGraph.Renderer.prototype._getRendererBlockById = function (id) {
    return this._rendererBlockIds.get(id) || null;
};

/**
 * Returns the rendererBlocks bound to the given cgBlock
 * @param {dudeGraph.Block} cgBlock
 * @returns {Array<dudeGraph.RendererBlock>}
 * @private
 */
dudeGraph.Renderer.prototype._getRendererBlocksByCgBlock = function (cgBlock) {
    var rendererBlocks = [];
    _.forEach(this._rendererBlocks, function (rendererBlock) {
        if (rendererBlock.cgBlock === cgBlock) {
            rendererBlocks.push(rendererBlock);
        }
    });
    return rendererBlocks;
};

/**
 * Creates a renderer block
 * @param {Object} rendererBlockData
 * @returns {dudeGraph.RendererBlock}
 * @private
 */
dudeGraph.Renderer.prototype._createRendererBlock = function (rendererBlockData) {
    if (!rendererBlockData.id) {
        throw new Error("Cannot create a rendererBlock without an id");
    }
    if (this._getRendererBlockById(rendererBlockData.id) !== null) {
        throw new Error("Multiple rendererBlocks for id `" + rendererBlockData.id + "`");
    }
    var cgBlock = this._cgGraph.blockById(rendererBlockData.cgBlock);
    if (!cgBlock) {
        throw new Error("Cannot link cgBlock `" + rendererBlockData.cgBlock +
            "` to rendererBlock `" + rendererBlockData.id + "`");
    }
    var rendererBlock = _.merge({}, rendererBlockData);
    rendererBlock.type = "block";
    rendererBlock.parent = null;
    rendererBlock.cgBlock = cgBlock;
    rendererBlock.id = rendererBlockData.id;
    rendererBlock.rendererPoints = [];
    rendererBlock.position = rendererBlockData.position || [0, 0];
    rendererBlock.size = rendererBlockData.size || this._config.block.size;
    this._createRendererPoints(rendererBlock);
    this._rendererBlocks.push(rendererBlock);
    this._rendererBlockIds.set(rendererBlock.id, rendererBlock);
    return rendererBlock;
};

/**
 * Removes the given rendererBlock, and all its rendererConnections
 * Also removes the cgBlock from the cgGraph if it is the last reference
 * @param {dudeGraph.RendererBlock} rendererBlock
 * @private
 */
dudeGraph.Renderer.prototype._removeRendererBlock = function (rendererBlock) {
    var renderer = this;
    var rendererBlockFound = this._rendererBlocks.indexOf(rendererBlock);
    if (rendererBlockFound === -1) {
        throw new Error("Cannot find rendererBlock `" + rendererBlock.id + "`");
    }
    _.forEach(rendererBlock.rendererPoints, function (rendererPoint) {
        renderer._removeRendererPointRendererConnections(rendererPoint);
    });
    this._removeRendererNodeParent(rendererBlock);
    this._rendererBlocks.splice(rendererBlockFound, 1);
    if (this._getRendererBlocksByCgBlock(rendererBlock.cgBlock).length === 0) {
        this._cgGraph.removeBlock(rendererBlock.cgBlock);
    }
};