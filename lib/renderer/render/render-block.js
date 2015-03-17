/**
 * Render blocks.
 * @private
 */
cg.Renderer.prototype._renderBlocks = function () {
    var blocks = this._blockLayer
        .selectAll("g")
        .data(this._graph.blocks());
    this._createBlocks(blocks);
    this._updateBlocks(blocks);
    this._removeBlocks(blocks);
};

/**
 *
 * @param blocks
 * @private
 */
cg.Renderer.prototype._createBlocks = function (blocks) {
    var blockGroup = blocks
        .enter()
        .append("svg:g")
        .attr({
            "class": function (block) { return "block " + block.model.type }
        });
    blockGroup
        .append("svg:rect")
        .attr({
            "class": "background",
            rx: this._config.block.borderRadius,
            ry: this._config.block.borderRadius
        });
    blockGroup
        .append("svg:text")
        .attr({
            "class": "title",
            "text-anchor": "middle"
        });
    blockGroup
        .append("svg:g")
        .attr({
            "class": "points"
        })
        .each(function(block) {
            block.data.maxInputWidth = 0;
            block.data.maxOutputWidth = 0;
            block.data.minInputHeight = 0;
        });
};

/**
 *
 * @param blocks
 * @private
 */
cg.Renderer.prototype._updateBlocks = function (blocks) {
    var renderer = this;
    blocks
        .attr("transform", function (block) { return "translate(" + block.absolutePosition.toArray() + ")" });
    var blockPointsGroup = blocks
        .select(".points");
    this._renderPoints(blockPointsGroup);
    blocks
        .select(".title")
        .text(function (block) { return block.name; });
    blocks
        .select(".background")
        .attr({
            rx: this._config.block.borderRadius,
            ry: this._config.block.borderRadius,
            x: 0,
            y: 0,
            width: function(block) { return block.data.maxInputWidth + block.data.maxOutputWidth + renderer._config.block.padding * 2 + renderer._config.block.centerSpacing; },
            height: function(block) { return block.data.minInputHeight + renderer._config.block.heading; }
        })
        .each(function(block) {
            block.data.computedWidth = d3.select(this).attr("width");
            block.data.computedHeight = d3.select(this).attr("height");
        });
    blocks
        .select(".title")
        .attr({
            x: function (block) { return block.data.computedWidth / 2; },
            y: this._config.block.padding
        });
    this._renderPoints(blockPointsGroup);
};

/**
 *
 * @param blocks
 * @private
 */
cg.Renderer.prototype._removeBlocks = function (blocks) {
    blocks
        .exit()
        .remove();
};