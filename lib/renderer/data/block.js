/**
 * Returns the renderBlock associated with the given id
 * @param {String} blockId
 * @returns {dudeGraph.RenderBlock|null}
 */
dudeGraph.Renderer.prototype.renderBlockById = function (blockId) {
    return this._renderBlockIds[blockId] || null;
};

/**
 * Returns the renderBlocks associated with the given block
 * @param {dudeGraph.Block} block
 */
dudeGraph.Renderer.prototype.renderBlocksByBlock = function (block) {
    return _.filter(this._renderBlocks, function (renderBlock) {
        return renderBlock.block === block;
    });
};

/**
 * Creates a render block bound to a block
 * @param {Object} renderBlockData
 * @param {Boolean} [forceUpdate=false] - Whether to force update the renderer
 * @returns {dudeGraph.RenderBlock}
 */
dudeGraph.Renderer.prototype.createRenderBlock = function (renderBlockData, forceUpdate) {
    var renderer = this;
    var block = this._graph.blockById(renderBlockData.cgBlock);
    if (block === null) {
        throw new Error("Unknown block `" + renderBlockData.cgBlock + "` for renderBlock `" + renderBlockData.id + "`");
    }
    var rendererBlockType = this._renderBlockTypes[block.blockType];
    if (!rendererBlockType) {
        throw new Error("Render block type `" + block.blockType + "` not registered in the renderer");
    }
    var renderBlock = rendererBlockType.buildRenderBlock(this, renderBlockData);
    if (renderBlock.nodeId === null ||  _.isUndefined(renderBlock.nodeId)) {
        throw new Error("Cannot create a renderBlock without an id");
    }
    var renderBlockFound = this.renderBlockById(renderBlock.nodeId);
    if (renderBlockFound !== null) {
        throw new Error("Duplicate renderBlocks for id `" + renderBlock.nodeId + "`: `" +
            renderBlockFound.nodeFancyName + "` was here before `" + renderBlock.nodeFancyName + "`");
    }
    this._renderBlocks.push(renderBlock);
    this._renderBlockIds[renderBlock.nodeId] = renderBlock;
    var createRenderPoint = function (point) {
        var renderPointCustomData = renderBlockData[point.isOutput ? "outputs": "inputs"];
        renderPointCustomData = renderPointCustomData && renderPointCustomData[point.cgName];
        renderer.createRenderPoint(renderBlock, {
            "renderPoint": renderPointCustomData,
            "point": point
        });
    };
    _.forEach(renderBlock.block.cgOutputs, createRenderPoint);
    _.forEach(renderBlock.block.cgInputs, createRenderPoint);
    if (forceUpdate) {
        this.createD3Blocks();
    }
    return renderBlock;
};

/**
 * Removes the given renderBlock and the underlying block
 * @param {dudeGraph.RenderBlock} renderBlock
 * @param {Boolean} [forceUpdate=false] - Whether to force update the renderer
 */
dudeGraph.Renderer.prototype.removeRenderBlock = function (renderBlock, forceUpdate) {
    var renderer = this;
    _.forEach(renderBlock.renderPoints, function (renderPoint) {
        renderer.emptyRenderPoint(renderPoint, forceUpdate);
    });
    _.pull(this._renderBlocks, renderBlock);
    if (_.isEmpty(this.renderBlocksByBlock(renderBlock.block))) {
        this._graph.removeBlock(renderBlock.block);
    }
    if (renderBlock.renderGroupParent) {
        renderBlock.renderGroupParent.removeChild(renderBlock);
    }
    if (forceUpdate) {
        if (renderBlock.renderGroupParent) {
            renderBlock.renderGroupParent.computePosition();
            renderBlock.renderGroupParent.computeSize();
            renderBlock.renderGroupParent.update();
        }
        this.removeD3Blocks();
    }
};