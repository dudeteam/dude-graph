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
            return this._getRendererNodeUniqueID(rendererBlock);
        }.bind(this))
        .attr("class", "cg-block")
        .call(this._dragRendererNodeBehavior())
        .call(this._removeRendererNodeFromParentBehavior());
    createdD3Blocks.each(function (rendererBlock) {
        if (renderer._renderBlockFunctions[pandora.typename(rendererBlock.cgBlock)]) {
            renderer._renderBlockFunctions[pandora.typename(rendererBlock.cgBlock)].create.call(this, rendererBlock);
        } else {
            d3.select(this)
                .append("svg:rect");
            d3.select(this)
                .append("svg:text")
                .text(function () {
                    return rendererBlock.cgBlock.cgName;
                })
                .attr("class", "cg-title")
                .attr("text-anchor", "middle")
                .attr("dominant-baseline", "text-before-edge")
                .attr("transform", function (block) {
                    return "translate(" + [block.size[0] / 2, renderer._config.block.padding] + ")";
                });
        }
    });
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
 * @param updatedD3Blocks {d3.selection}
 * @private
 */
cg.Renderer.prototype._updateSelectedD3Blocks = function (updatedD3Blocks) {
    var renderer = this;
    updatedD3Blocks
        .attr("transform", function (rendererBlock) {
            return "translate(" + rendererBlock.position + ")";
        });
    updatedD3Blocks
        .each(function (rendererBlock) {
            if (renderer._renderBlockFunctions[pandora.typename(rendererBlock.cgBlock)]) {
                renderer._renderBlockFunctions[pandora.typename(rendererBlock.cgBlock)].update.call(this, rendererBlock);
            } else {
                var d3Block = d3.select(this);
                renderer._createD3Points(d3Block.append("svg:g"));
                d3Block
                    .select("rect")
                    .attr("rx", 5)
                    .attr("ry", 5)
                    .attr("width", function () {
                        return rendererBlock.size[0];
                    })
                    .attr("height", function () {
                        return rendererBlock.size[1];
                    });
            }
        });
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