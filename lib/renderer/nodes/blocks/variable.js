/**
 * @param {dudeGraph.Renderer} renderer
 * @param {dudeGraph.Block} block
 * @param {String} blockId
 * @class
 * @extends {dudeGraph.RenderBlock}
 */
dudeGraph.RenderVariableBlock = function (renderer, block, blockId) {
    dudeGraph.RenderBlock.call(this, renderer, block, blockId, "dude-graph-edit-variable");
};

dudeGraph.RenderVariableBlock.prototype = _.create(dudeGraph.RenderBlock.prototype, {
    "constructor": dudeGraph.RenderVariableBlock,
    "className": "RenderVariableBlock"
});

/**
 * Creates the d3Block for this renderBlock
 * @param {d3.selection} d3Block
 * @override
 */
dudeGraph.RenderVariableBlock.prototype.create = function (d3Block) {
    dudeGraph.RenderBlock.prototype.create.call(this, d3Block);
    var variableType = this.block.blockOutputs[0].pointValueType;
    var variableColor = this._renderer.config.typeColors[variableType];
    if (!_.isUndefined(variableColor)) {
        this._d3Title.attr("style", "fill: " + variableColor + ";");
    }
};

/**
 * Updates the d3Block for this renderBlock
 * @override
 */
dudeGraph.RenderVariableBlock.prototype.update = function () {
    dudeGraph.RenderBlock.prototype.update.call(this);
};

/**
 * Computes the renderBlock size
 * @override
 */
dudeGraph.RenderVariableBlock.prototype.computeSize = function () {
    this._nodeSize = [
        this._renderer.measureText(this._nodeName)[0] + this._renderer.config.point.padding * 4,
        40
    ];
};

/**
 * Builds a renderPoint from data
 * @param {Object} renderPointData
 * @returns {dudeGraph.RenderPoint}
 * @override
 */
dudeGraph.RenderVariableBlock.prototype.createRenderPoint = function (renderPointData) {
    return dudeGraph.RenderVariablePoint.buildRenderPoint(this._renderer, this, renderPointData);
};

/**
 * RenderVariableBlock factory
 * @param {dudeGraph.Renderer} renderer
 * @param {Object} renderBlockData
 */
dudeGraph.RenderVariableBlock.buildRenderBlock = function (renderer, renderBlockData) {
    return dudeGraph.RenderBlock.buildRenderBlock.call(this, renderer, renderBlockData);
};