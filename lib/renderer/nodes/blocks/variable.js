/**
 * @param {dudeGraph.Renderer} renderer
 * @param {dudeGraph.Block} block
 * @param {String} blockId
 * @class
 * @extends {dudeGraph.RenderBlock}
 */
dudeGraph.RenderVariable = function (renderer, block, blockId) {
    dudeGraph.RenderBlock.call(this, renderer, block, blockId);
};

dudeGraph.RenderVariable.prototype = _.create(dudeGraph.RenderBlock.prototype, {
    "constructor": dudeGraph.RenderVariable
});

/**
 *
 * @param d3Block
 */
dudeGraph.RenderVariable.prototype.create = function (d3Block) {
    dudeGraph.RenderBlock.prototype.create.call(this, d3Block);
    var variableType = this.block.cgOutputs[0].cgValueType;
    var variableColor = this._renderer.config.typeColors[variableType];
    if (!_.isUndefined(variableColor)) {
        this._d3Rect.attr("style", "fill: " + variableColor + "; stroke: " + variableColor + ";");
    }
};

/**
 *
 * @param d3Block
 */
dudeGraph.RenderVariable.prototype.update = function (d3Block) {
    dudeGraph.RenderBlock.prototype.update.call(this, d3Block);
};

/**
 * RenderVariable factory
 * @param {dudeGraph.Renderer} renderer
 * @param {Object} renderBlockData
 */
dudeGraph.RenderVariable.buildRenderBlock = function (renderer, renderBlockData) {
    return dudeGraph.RenderBlock.buildRenderBlock.call(this, renderer, renderBlockData);
};