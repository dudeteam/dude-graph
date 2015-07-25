/**
 * Renderer the new blocks
 * @private
 */
cg.Renderer.prototype._createBlocks = function () {
    var createdBlocks = this._blocksSvg
        .selectAll(".cg-block")
        .data(this._blocks, function (block) {
            return block.id;
        })
        .enter()
        .append("svg:g")
        .attr("id", function (block) {
            return "cg-block-" + block.id;
        })
        .attr("class", "cg-block")
        .call(this._createDragBehavior());
    createdBlocks
        .append("svg:rect");
    this._updateBlocks();
};

/**
 * Update the existing blocks
 * @private
 */
cg.Renderer.prototype._updateBlocks = function () {
    var updatedBlocks = this._blocksSvg
        .selectAll(".cg-block")
        .attr("transform", function (block) {
            return "translate(" + block.position + ")";
        });
    updatedBlocks
        .select("rect")
        .attr("rx", 5).attr("ry", 5)
        .attr("width", function () {
            return 100;
        })
        .attr("height", function () {
            return 100;
        });
};

/**
 * Remove the old blocks
 * @private
 */
cg.Renderer.prototype._removeBlocks = function () {
    var removedBlocks = this._blocksSvg
        .selectAll(".cg-block")
        .data(this._blocks, function (block) {
            return block.id;
        })
        .exit()
        .each(function (block) {
            console.log("Block", block.id, "removed from svg")
        })
        .remove();
};

/**
 * Adds a new cgBlock to the renderer
 * @param cgBlock {cg.Block}
 * @private
 */
cg.Renderer.prototype._addCgBlock = function (cgBlock) {
    this._blocks.push({
        "id": cgBlock.cgId,
        "type": "block",
        "description": cgBlock.cgName,
        "cgBlock": cgBlock,
        "position": cgBlock.cgPosition || [0, 0]
    });
    this._blockIds.set(cgBlock.cgId, this._blocks[this._blocks.length - 1]);
    this._createBlocks();
};

/**
 * Removed a cgBlock from the renderer
 * @param cgBlock
 * @private
 */
cg.Renderer.prototype._removeCgBlock = function (cgBlock) {
    this._blocks.splice(this._blocks.indexOf(this._blockIds.get(cgBlock.cgId)), 1);
    this._blockIds.remove(cgBlock.cgId);
    this._removeBlocks();
};