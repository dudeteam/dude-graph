/**
 * Creates renderer blocks
 * @private
 */
cg.Renderer.prototype._createRendererBlocks = function () {
    var createdRendererBlocks = this._blocksSvg
        .selectAll(".cg-block")
        .data(this._rendererBlocks, function (block) {
            return block.id;
        })
        .enter()
        .append("svg:g")
        .attr("id", function (block) {
            return "cg-block-" + block.id;
        })
        .attr("class", "cg-block")
        .call(this._createDragBehavior());
    createdRendererBlocks
        .append("svg:rect");
    this._updateRendererBlocks();
};

/**
 * Updates renderer blocks
 * @private
 */
cg.Renderer.prototype._updateRendererBlocks = function () {
    var updatedRendererBlocks = this._blocksSvg
        .selectAll(".cg-block")
        .attr("transform", function (block) {
            return "translate(" + block.position + ")";
        });
    updatedRendererBlocks
        .select("rect")
        .attr("rx", 5)
        .attr("ry", 5)
        .attr("width", function () {
            return 100;
        })
        .attr("height", function () {
            return 100;
        });
};

/**
 * Removes renderer blocks
 * @private
 */
cg.Renderer.prototype._removeRendererBlocks = function () {
    var removedRendererBlocks = this._blocksSvg
        .selectAll(".cg-block")
        .data(this._rendererBlocks, function (block) {
            return block.id;
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
        "position": cgBlock.cgPosition || [0, 0]
    });
    this._rendererBlockIds.set(cgBlock.cgId, this._rendererBlocks[this._rendererBlocks.length - 1]);
    this._createRendererBlocks();
};

/**
 * Removes the renderer block linked with the given cgBlock
 * @param cgBlock {cg.cgBlock}
 * @private
 */
cg.Renderer.prototype._removeCgBlock = function (cgBlock) {
    this._rendererBlocks.splice(this._rendererBlocks.indexOf(this._rendererBlockIds.get(cgBlock.cgId)), 1);
    this._rendererBlockIds.remove(cgBlock.cgId);
    this._removeRendererBlocks();
};