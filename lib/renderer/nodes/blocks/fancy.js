/**
 * @param {dudeGraph.Renderer} renderer
 * @param {dudeGraph.Block} block
 * @param {String} blockId
 * @class
 * @extends {dudeGraph.RenderBlock}
 */
dudeGraph.RenderFancyBlock = function (renderer, block, blockId) {
    dudeGraph.RenderBlock.call(this, renderer, block, blockId);

    this._d3RectPoints = null;
};

dudeGraph.RenderFancyBlock.prototype = _.create(dudeGraph.RenderBlock.prototype, {
    "constructor": dudeGraph.RenderFancyBlock,
    "className": "RenderFancyBlock"
});

/**
 * Creates the d3Block for this renderBlock
 * @param {d3.selection} d3Block
 * @override
 */
dudeGraph.RenderFancyBlock.prototype.create = function (d3Block) {
    dudeGraph.RenderBlock.prototype.create.call(this, d3Block, false);
    this._d3RectPoints = this._d3Node.insert("svg:rect", ".dude-graph-points")
        .attr({
            "fill": this._renderer.config.blockColors.default
        });
    this._d3Node.classed("dude-graph-block-dark", true);
    this._d3Node.classed("dude-graph-block-white", false);
    this.update();
};

/**
 * Updates the d3Block for this renderBlock
 * @override
 */
dudeGraph.RenderFancyBlock.prototype.update = function (d3Block) {
    dudeGraph.RenderBlock.prototype.update.call(this, d3Block);
    this._d3Rect
        .attr({
            "width": this._nodeSize[0],
            "height": this._renderer.config.block.header
        });
    this._d3RectPoints
        .attr({
            "y": this._renderer.config.block.header - 16,
            "width": this._nodeSize[0],
            "height": this._nodeSize[1] - this._renderer.config.block.header + 16
        });
};

/**
 * RenderVariableBlock factory
 * @param {dudeGraph.Renderer} renderer
 * @param {Object} renderBlockData
 */
dudeGraph.RenderFancyBlock.buildRenderBlock = function (renderer, renderBlockData) {
    return dudeGraph.RenderBlock.buildRenderBlock.call(this, renderer, renderBlockData);
};