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
 * @override
 */
dudeGraph.RenderVariable.prototype.create = function (d3Block) {
    dudeGraph.RenderBlock.prototype.create.call(this, d3Block);
    var variableType = this.block.cgOutputs[0].cgValueType;
    var variableColor = this._renderer.config.typeColors[variableType];
    if (!_.isUndefined(variableColor)) {
        this._d3Title.attr("style", "fill: " + variableColor);
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
    var widerOutput = _.max(this.renderOutputPoints, function (renderPoint) {
        return renderPoint.pointSize[0];
    });
    var widerInput = _.max(this.renderInputPoints, function (renderPoint) {
        return renderPoint.pointSize[0];
    });
    var titleWidth = this._renderer.measureText(this._nodeName)[0];
    var maxOutputWidth = widerOutput !== -Infinity ? widerOutput.pointSize[0] : 0;
    var maxInputWidth = widerInput !== -Infinity ? widerInput.pointSize[0] : 0;
    var maxWidth = Math.max(
        titleWidth + this._renderer.config.block.padding * 2,
        maxOutputWidth + maxInputWidth + this._renderer.config.block.pointSpacing
    );
    this._nodeSize = [
        maxWidth,
        40
    ];
};

/**
 * RenderVariable factory
 * @param {dudeGraph.Renderer} renderer
 * @param {Object} renderBlockData
 */
dudeGraph.RenderVariable.buildRenderBlock = function (renderer, renderBlockData) {
    return dudeGraph.RenderBlock.buildRenderBlock.call(this, renderer, renderBlockData);
};