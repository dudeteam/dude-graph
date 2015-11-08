/**
 * Creates d3Blocks with the existing rendererBlocks
 * @private
 */
dudeGraph.Renderer.prototype._createD3Blocks = function () {
    var renderer = this;
    var createdBlocks = this.d3Blocks
        .data(this._rendererBlocks, function (rendererBlock) {
            rendererBlock.size = renderer._computeDefaultRendererBlockSize(rendererBlock);
            return rendererBlock.id;
        })
        .enter()
        .append("svg:g")
        .attr("id", function (rendererBlock) {
            return renderer._getRendererNodeUniqueID(rendererBlock);
        })
        .classed("dude-graph-block", true)
        .call(this._dragRendererNodeBehavior())
        .call(this._removeRendererNodeFromParentBehavior())
        .each(function (rendererBlock) {
            d3.select(this).classed("dude-graph-block-" + _.kebabCase(rendererBlock.cgBlock.blockType), true);
        });
    createdBlocks.append("svg:rect")
        .attr("rx", function () {
            return renderer._config.block.borderRadius || 0;
        })
        .attr("ry", function () {
            return renderer._config.block.borderRadius || 0;
        });
    createdBlocks
        .append("svg:text")
        .classed("dude-graph-title", true)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "text-before-edge");
    createdBlocks
        .append("svg:g")
        .classed("cg-points", true);
    renderer._createD3Points(createdBlocks.select(".cg-points"));
    this._updateD3Blocks();
};

/**
 * Updates all d3Blocks
 * @private
 */
dudeGraph.Renderer.prototype._updateD3Blocks = function () {
    this._updateSelectedD3Blocks(this.d3Blocks);
};

/**
 * Updates selected d3Blocks
 * @param {d3.selection} updatedD3Blocks
 * @private
 */
dudeGraph.Renderer.prototype._updateSelectedD3Blocks = function (updatedD3Blocks) {
    var renderer = this;
    updatedD3Blocks
        .select("text")
        .text(function (rendererBlock) {
            return rendererBlock.cgBlock.cgName;
        });
    updatedD3Blocks
        .each(function (rendererBlock) {
            renderer._computeRendererBlockSize(rendererBlock);
        });
    updatedD3Blocks
        .attr("transform", function (rendererBlock) {
            return "translate(" + rendererBlock.position + ")";
        });
    updatedD3Blocks
        .select("rect")
        .attr("width", function (rendererBlock) {
            return rendererBlock.size[0];
        })
        .attr("height", function (rendererBlock) {
            return rendererBlock.size[1];
        });
    updatedD3Blocks
        .select("text")
        .attr("transform", function (block) {
            return "translate(" + [block.size[0] / 2, renderer._config.block.padding] + ")";
        });
    renderer._updateSelectedD3Points(updatedD3Blocks.select(".cg-points").selectAll(".dude-graph-output, .dude-graph-input"));
};

/**
 * Removes d3Blocks when rendererBlocks are removed
 * @private
 */
dudeGraph.Renderer.prototype._removeD3Blocks = function () {
    var removedRendererBlocks = this.d3Blocks
        .data(this._rendererBlocks, function (rendererBlock) {
            return rendererBlock.id;
        })
        .exit()
        .remove();
};