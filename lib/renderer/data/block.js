/**
 * Returns the renderBlock associated with the given id
 * @param {String} blockId
 * @returns {dudeGraph.RenderBlock|null}
 */
dudeGraph.Renderer.prototype.getRenderBlockById = function (blockId) {
    return this._renderBlockIds[blockId] || null;
};

/**
 * Creates a render block bound to a block
 * @param {Object} renderBlockData
 * @returns {dudeGraph.RenderBlock}
 */
dudeGraph.Renderer.prototype.createRenderBlock = function (renderBlockData) {
    var block = this._graph.blockById(renderBlockData.cgBlock);
    if (block === null) {
        throw 42; // TODO: remove
    }
    var rendererBlockType = this._renderBlockTypes[block.blockType];
    if (!rendererBlockType) {
        throw new Error("Render block type `" + block.blockType + "` not registered in the renderer");
    }
    var renderBlock = rendererBlockType.buildRenderBlock(this, renderBlockData);
    if (renderBlock.nodeId === null) {
        throw new Error("Cannot create a renderBlock without an id");
    }
    var renderBlockFound = this.getRenderBlockById(renderBlock.nodeId);
    if (renderBlockFound !== null) {
        throw new Error("Duplicate renderBlocks for id `" + renderBlock.nodeId + "`: `" +
            renderBlockFound.nodeFancyName + "` was here before `" + renderBlock.nodeFancyName + "`");
    }
    this._renderBlocks.push(renderBlock);
    this._renderBlockIds[renderBlock.nodeId] = renderBlock;
    return renderBlock;
};