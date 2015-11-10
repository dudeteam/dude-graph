/**
 * Creates d3Blocks with the existing renderBlocks
 * @private
 */
dudeGraph.Renderer.prototype._createD3Blocks = function () {
    this.d3Blocks
        .data(this._renderBlocks, function (renderBlock) {
            return renderBlock.nodeId;
        })
        .enter()
        .append("svg:g")
        .attr("id", function (renderBlock) {
            return renderBlock.nodeId;
        })
        .classed("dude-graph-block", true)
        .each(function (renderBlock) {
            renderBlock.create(d3.select(this));
        });
    this._updateD3Blocks();
};

/**
 * Creates d3Blocks with the existing renderBlocks
 * @private
 */
dudeGraph.Renderer.prototype._updateD3Blocks = function () {
    this.d3Blocks.each(function (renderBlock) {
        renderBlock.update();
    });
};

/**
 * Removes d3Blocks when rendererBlocks are removed
 * @private
 */
dudeGraph.Renderer.prototype._removeD3Blocks = function () {
    this.d3Blocks
        .data(this._renderBlocks, function (renderBlock) {
            return renderBlock.nodeId;
        })
        .exit()
        .each(function (renderBlock) {
            renderBlock.remove();
        })
        .remove();
};