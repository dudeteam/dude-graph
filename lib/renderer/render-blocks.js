/**
 * Creates renderer blocks
 * @private
 */
cg.Renderer.prototype._createRendererBlocks = function () {
    var createdRendererBlocks = this._blocksSvg
        .selectAll(".cg-block")
        .data(this._rendererBlocks, function (rendererBlock) {
            rendererBlock.size = rendererBlock.size || [100, 100];
            return rendererBlock.id;
        })
        .enter()
        .append("svg:g")
        .attr("id", function (rendererBlock) {
            return this._getUniqueElementId(rendererBlock);
        }.bind(this))
        .attr("class", "cg-block")
        .call(this._createDragBehavior());
    createdRendererBlocks
        .append("svg:rect");
    createdRendererBlocks
        .append("svg:text")
        .attr("class", "cg-title")
        .text(function (block) {
            return this._cgGraph.blockById(block.id).cgName;
        }.bind(this))
        .attr("transform", "translate(" + [0, 15] + ")");
    this._updateRendererBlocks();
};

/**
 * Updates all renderer blocks
 * @private
 */
cg.Renderer.prototype._updateRendererBlocks = function () {
    this._updateSelectedRendererBlocks(this._blocksSvg.selectAll(".cg-block"));
};

/**
 * Updates selected renderer blocks
 * @private
 */
cg.Renderer.prototype._updateSelectedRendererBlocks = function (updatedRendererBlocks) {
    updatedRendererBlocks
        .attr("transform", function (rendererBlock) {
            return "translate(" + rendererBlock.position + ")";
        });
    this._createRendererPoints(updatedRendererBlocks.append("svg:g"));
    updatedRendererBlocks
        .select("rect")
        .attr("rx", 5)
        .attr("ry", 5).attr("width", function () {
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