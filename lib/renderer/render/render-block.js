/**
 * Creates d3Blocks with the existing rendererBlocks
 * @private
 */
cg.Renderer.prototype._createD3Blocks = function () {
    var renderer = this;
    var createdD3Blocks = this.d3Blocks
        .data(this._rendererBlocks, function (rendererBlock) {
            var nbPoints = Math.max(rendererBlock.cgBlock.cgInputs.length, rendererBlock.cgBlock.cgOutputs.length);
            rendererBlock.size = [
                renderer._config.block.size[0],
                nbPoints * renderer._config.point.height + renderer._config.block.header
            ];
            return rendererBlock.id;
        })
        .enter()
        .append("svg:g")
        .attr("id", function (rendererBlock) {
            return renderer._getRendererNodeUniqueID(rendererBlock);
        })
        .classed("cg-block", true)
        .call(this._dragRendererNodeBehavior())
        .call(this._removeRendererNodeFromParentBehavior())
        .each(function (rendererBlock) {
            d3.select(this).classed("cg-" + pandora.typename(rendererBlock.cgBlock).toLowerCase(), true);
        });
    createdD3Blocks
        .append("svg:rect")
        .attr("rx", function (rendererBlock) {
            return ["Variable", "Value"].indexOf(pandora.typename(rendererBlock.cgBlock)) !== -1 ? 30 : 5;
        })
        .attr("ry", function (rendererBlock) {
            return ["Variable", "Value"].indexOf(pandora.typename(rendererBlock.cgBlock)) !== -1 ? 30 : 5;
        });
    createdD3Blocks
        .append("svg:text")
        .classed("cg-title", true)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "text-before-edge");
    createdD3Blocks
        .append("svg:g")
        .classed("cg-points", true);
    this._createD3Points(createdD3Blocks.select(".cg-points"));
    this._updateD3Blocks();
};

/**
 * Updates all d3Blocks
 * @private
 */
cg.Renderer.prototype._updateD3Blocks = function () {
    this._updateSelectedD3Blocks(this.d3Blocks);
};

/**
 * Updates selected d3Blocks
 * @param {d3.selection} updatedD3Blocks
 * @private
 */
cg.Renderer.prototype._updateSelectedD3Blocks = function (updatedD3Blocks) {
    var renderer = this;
    updatedD3Blocks
        .select("text")
        .text(function (rendererBlock) {
            return rendererBlock.cgBlock.cgName;
        });
    updatedD3Blocks
        .each(renderer._computeRendererBlockSize.bind(renderer));
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
    this._updateSelectedD3Points(updatedD3Blocks.select(".cg-points").selectAll(".cg-output, .cg-input"));
};

/**
 * Removes d3Blocks when rendererBlocks are removed
 * @private
 */
cg.Renderer.prototype._removeD3Blocks = function () {
    var removedRendererBlocks = this.d3Blocks
        .data(this._rendererBlocks, function (rendererBlock) {
            return rendererBlock.id;
        })
        .exit()
        .remove();
};