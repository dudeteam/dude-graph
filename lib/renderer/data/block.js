/**
 * Returns the renderBlock associated with the given id
 * @param {String} blockId
 * @returns {dudeGraph.RenderBlock|null}
 * @private
 */
dudeGraph.Renderer.prototype._getRenderBlockById = function (blockId) {
    return this._renderBlockIds[blockId] || null;
};

/**
 * Creates a renderer block bound to a cgBlock
 * @param {Object} renderBlockData
 * @returns {dudeGraph.RenderBlock}
 * @private
 */
dudeGraph.Renderer.prototype._createRenderBlock = function (renderBlockData) {
    if (!renderBlockData.id) {
        throw new Error("Cannot create a renderBlock without an id");
    }
    if (this._getRenderBlockById(renderBlockData.id) !== null) {
        throw new Error("Multiple renderBlocks for id `" + renderBlockData.id + "`");
    }
    var block = this._graph.blockById(renderBlockData.cgBlock);
    if (!block) {
        throw new Error("Cannot link cgBlock `" + renderBlockData.cgBlock +
            "` to renderBlock `" + renderBlockData.id + "`");
    }
    var renderBlockConstructor = this._renderBlockTypes[block.blockType];
    if (!renderBlockConstructor) {
        throw new Error("Render block `" + block.blockType + "` not registered in the renderer");
    }
    var renderBlock = new renderBlockConstructor(renderBlockData.id, block);
    renderBlock.nodeName = renderBlockData.description || block.cgName || "";
    renderBlock.nodePosition = renderBlockData.position || [0, 0];
    renderBlock.parentGroup = renderBlockData.parent || null;
    renderBlock.renderPoints = Array.prototype.concat(
        _.map(block.cgOutputs, function (cgOutput, i) {
            return new dudeGraph.RenderPoint(renderBlock, cgOutput, i);
        }),
        _.map(block.cgInputs, function (cgInput, i) {
            return new dudeGraph.RenderPoint(renderBlock, cgInput, i);
        })
    );
    this._renderBlocks.push(renderBlock);
    this._renderBlockIds[renderBlock.nodeId] = renderBlock;
    return renderBlock;
};