/**
 * Returns the rendererNode associated with the given id
 * @param id
 * @returns {cg.RendererBlock|null}
 * @private
 */
cg.Renderer.prototype._getRendererBlockById = function (id) {
    return this._rendererBlockIds.get(id) || null;
};

/**
 * Returns the rendererBlocks bound to the given cgBlock
 * @param cgBlock {cg.Block}
 * @returns {Array<cg.RendererBlock>}
 * @private
 */
cg.Renderer.prototype._getRendererBlocksByCgBlock = function (cgBlock) {
    var rendererBlocks = [];
    pandora.forEach(this._rendererBlocks, function (rendererBlock) {
        if (rendererBlock.cgBlock === cgBlock) {
            rendererBlocks.push(rendererBlock);
        }
    });
    return rendererBlocks;
};

/**
 * Creates a renderer block
 * @param rendererBlockData
 * @returns {cg.RendererBlock}
 * @private
 */
cg.Renderer.prototype._createRendererBlock = function (rendererBlockData) {
    if (!rendererBlockData.id) {
        throw new cg.RendererError("Renderer::_createRendererBlock() Cannot create a rendererBlock without an id");
    }
    if (this._getRendererBlockById(rendererBlockData.id) !== null) {
        throw new cg.RendererError("Renderer::_createRendererBlock() Multiple rendererBlocks for id `{0}`", rendererBlockData.id);
    }
    var cgBlock = this._cgGraph.blockById(rendererBlockData.cgBlock);
    if (!cgBlock) {
        throw new cg.RendererError("Renderer::_createRendererBlock() Cannot link cgBlock `{0}` to rendererBlock `{1}`", rendererBlockData.cgBlock, rendererBlockData.id);
    }
    var rendererBlock = pandora.mergeObjects({}, rendererBlockData, true, true);
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
 * @param rendererBlock {cg.RendererBlock}
 * @private
 */
cg.Renderer.prototype._removeRendererBlock = function (rendererBlock) {
    var renderer = this;
    var rendererBlockFound = this._rendererBlocks.indexOf(rendererBlock);
    if (rendererBlockFound === -1) {
        throw new cg.RendererError("Renderer::_removeRendererBlock() Cannot find rendererBlock");
    }
    pandora.forEach(rendererBlock.rendererPoints, function (rendererPoint) {
        renderer._removeRendererPointRendererConnections(rendererPoint);
    });
    this._removeRendererNodeParent(rendererBlock);
    this._rendererBlocks.splice(rendererBlockFound, 1);
    if (this._getRendererBlocksByCgBlock(rendererBlock.cgBlock).length === 0) {
        this._cgGraph.removeBlock(rendererBlock.cgBlock);
    }
};