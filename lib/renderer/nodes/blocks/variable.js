/**
 * @param {dudeGraph.Renderer} renderer
 * @param {dudeGraph.Block} block
 * @param {String} blockId
 * @class
 * @extends {dudeGraph.RenderBlock}
 */
dudeGraph.RenderVariable = function (renderer, block, blockId) {
    dudeGraph.RenderBlock.call(this, renderer, block, blockId, "dude-graph-edit-variable");
};

dudeGraph.RenderVariable.prototype = _.create(dudeGraph.RenderBlock.prototype, {
    "constructor": dudeGraph.RenderVariable
});

/**
 *
 * @param d3Block
 * @override
 */
dudeGraph.RenderVariable.prototype.create = function (d3Block) {
    dudeGraph.RenderBlock.prototype.create.call(this, d3Block);
    var variableType = this.block.blockOutputs[0].pointValueType;
    var variableColor = this._renderer.config.typeColors[variableType];
    if (!_.isUndefined(variableColor)) {
        this._d3Title.attr("style", "fill: " + variableColor + ";");
    }
};

/**
 *
 * @param d3Block
 * @override
 */
dudeGraph.RenderVariable.prototype.update = function (d3Block) {
    dudeGraph.RenderBlock.prototype.update.call(this, d3Block);
};

/**
 * @override
 */
dudeGraph.RenderVariable.prototype.computeSize = function () {
    this._nodeSize = [
        this._renderer.measureText(this._nodeName)[0] + this._renderer.config.point.padding * 4,
        40
    ];
};

/**
 * Builds a renderPoint from data
 * @param {Object} renderPointData
 * @returns {dudeGraph.RenderPoint}
 */
dudeGraph.RenderVariable.prototype.createRenderPoint = function (renderPointData) {
    return dudeGraph.RenderPointVariable.buildRenderPoint(this._renderer, this, renderPointData);
};

/**
 * RenderVariable factory
 * @param {dudeGraph.Renderer} renderer
 * @param {Object} renderBlockData
 */
dudeGraph.RenderVariable.buildRenderBlock = function (renderer, renderBlockData) {
    return dudeGraph.RenderBlock.buildRenderBlock.call(this, renderer, renderBlockData);
};