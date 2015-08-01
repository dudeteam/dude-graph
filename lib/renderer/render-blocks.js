/**
 * Creates d3Blocks with the existing rendererBlocks
 * @private
 */
cg.Renderer.prototype._createD3Blocks = function () {
    var renderer = this;
    var createdD3Blocks = this._blocksSvg
        .selectAll(".cg-block")
        .data(this._rendererBlocks, function (rendererBlock) {
            var cgBlock = renderer._cgGraph.blockById(rendererBlock.id);
            var nbPoints = Math.max(cgBlock.cgInputs.length, cgBlock.cgOutputs.length);
            rendererBlock.size = [
                150,
                nbPoints * renderer._config.point.height + renderer._config.block.header
            ];
            return rendererBlock.id;
        })
        .enter()
        .append("svg:g")
            .attr("id", function (rendererBlock) {
                return this._getUniqueElementId(rendererBlock);
            }.bind(this))
            .attr("class", "cg-block")
            .call(this._createDragBehavior());
    createdD3Blocks
        .append("svg:rect");
    createdD3Blocks
        .append("svg:text")
            .text(function (block) {
                return renderer._cgGraph.blockById(block.id).cgName;
            })
            .attr("class", "cg-title")
            .attr("text-anchor", "middle")
            .attr("alignment-baseline", "text-before-edge")
            .attr("transform", function (block) {
                return "translate(" + [block.size[0] / 2, renderer._config.block.padding] + ")";
            });
    this._updateD3Blocks();
};

/**
 * Updates all d3Blocks
 * @private
 */
cg.Renderer.prototype._updateD3Blocks = function () {
    this._updateSelectedD3Blocks(this._blocksSvg.selectAll(".cg-block"));
};

/**
 * Updates selected d3Blocks
 * @param updatedD3Blocks {d3.selection}
 * @private
 */
cg.Renderer.prototype._updateSelectedD3Blocks = function (updatedD3Blocks) {
    updatedD3Blocks
        .attr("transform", function (rendererBlock) {
            return "translate(" + rendererBlock.position + ")";
        });
    this._createRendererPoints(updatedD3Blocks.append("svg:g"));
    updatedD3Blocks
        .select("rect")
        .attr("rx", 5)
        .attr("ry", 5)
        .attr("width", function (rendererBlock) {
            return rendererBlock.size[0];
        })
        .attr("height", function (rendererBlock) {
            return rendererBlock.size[1];
        });
};

/**
 * Removes d3Blocks when rendererBlocks are removed
 * @private
 */
cg.Renderer.prototype._removeD3Blocks = function () {
    var removedRendererBlocks = this._blocksSvg
        .selectAll(".cg-block")
            .data(this._rendererBlocks, function (rendererBlock) {
                return rendererBlock.id;
            })
            .exit()
            .remove();
};

/**
 * Adds a new renderer block with the given cgBlock
 * @param cgBlock {cg.cgBlock}
 * @private
 */
cg.Renderer.prototype._addCgBlock = function (cgBlock) {
    this._rendererBlocks.push({
        "id": cgBlock.cgId,
        "type": "block",
        "cgBlock": cgBlock,
        "description": cgBlock.cgName,
        "position": cgBlock.cgPosition || [0, 0],
        "size": cgBlock.cgSize || [0, 0]
    });
    this._rendererBlockIds.set(cgBlock.cgId, this._rendererBlocks[this._rendererBlocks.length - 1]);
    this._createD3Blocks();
};

/**
 * Removes the d3Block and the renderer block linked with the given cgBlock
 * @param cgBlock {cg.cgBlock}
 * @private
 */
cg.Renderer.prototype._removeCgBlock = function (cgBlock) {
    this._rendererBlocks.splice(this._rendererBlocks.indexOf(this._rendererBlockIds.get(cgBlock.cgId)), 1);
    this._rendererBlockIds.remove(cgBlock.cgId);
    this._removeD3Blocks();
};