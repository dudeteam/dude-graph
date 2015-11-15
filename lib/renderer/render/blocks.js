/**
 * Creates d3Blocks with the existing renderBlocks
 */
dudeGraph.Renderer.prototype.createD3Blocks = function () {
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
            renderBlock.moveEvent();
        });
    this.updateD3Blocks();
};

/**
 * Updates d3Blocks with the existing renderBlocks
 */
dudeGraph.Renderer.prototype.updateD3Blocks = function () {
    this.d3Blocks.each(function (renderBlock) {
        renderBlock.update();
    });
};

/**
 * Removes d3Blocks when rendererBlocks are removed
 */
dudeGraph.Renderer.prototype.removeD3Blocks = function () {
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