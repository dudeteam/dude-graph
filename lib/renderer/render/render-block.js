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
    var renderer = this;
    var createdBlocks = blocks
        .enter()
        .append("svg:g");
    createdBlocks
        .append("svg:rect")
        .attr({
            "class": "background",
            rx: this._config.block.borderRadius,
            ry: this._config.block.borderRadius
        });
    createdBlocks
        .append("svg:g")
        .attr({
            "class": "points"
        })
        .each(function(block) {
            block.data.maxInputWidth = 0;
            block.data.maxOutputWidth = 0;
            block.data.pointHeight = 0;
        });
    createdBlocks
        .each(function (block) {
            pandora.polymorphicMethod(renderer, "createBlock", block.model, block, d3.select(this));
        });
};

cg.Renderer.prototype._createBlockAction = function (model, block, element) {
    element.attr("class", ["block", model.type].join(" "));
    element.append("svg:text").attr({
        "class": "title",
        "text-anchor": "middle",
        "alignment-baseline": "baseline"
    });
};

cg.Renderer.prototype._createBlockGetter = function (model, block, element) {
    element.attr("class", ["block", model.type, "type-" + block.model.valueType].join(" "));
    element.append("svg:text").attr({
        "class": "title",
        "text-anchor": "start",
        "alignment-baseline": "middle"
    });
};

cg.Renderer.prototype._createBlockPicker = function (model, block, element) {
    element.attr("class", ["block", model.type, "type-" + block.model.valueType].join(" "));
    element.append("svg:text").attr({
        "class": "title",
        "text-anchor": "start",
        "alignment-baseline": "middle"
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
            width: function(block) {
                var width = renderer._config.block.padding * 2;
                pandora.polymorphic(block.model, {
                    "Action": function () {
                        width += Math.max(
                            d3.select(this.parentNode).select(".title").node().getBBox().width,
                            block.data.maxInputWidth + block.data.maxOutputWidth + renderer._config.block.centerSpacing
                        );
                    }.bind(this),
                    "Getter": function () {
                        width += d3.select(this.parentNode).select(".title").node().getBBox().width;
                        width += renderer._config.block.padding + renderer._config.point['circle-size'];
                    }.bind(this),
                    "Picker": function () {
                        width += d3.select(this.parentNode).select(".title").node().getBBox().width;
                        width += renderer._config.block.padding + renderer._config.point['circle-size'];
                    }.bind(this)
                });
                return width;
            },
            height: function(block) {
                var height = 0;
                pandora.polymorphic(block.model, {
                    "Action": function () {
                        height += renderer._config.block.heading;
                        height += block.data.pointHeight * Math.max(block.inputs.length, block.outputs.length);
                        block.data.computedHeadingOffset = renderer._config.block.heading;
                    },
                    "Getter": function () {
                        height += renderer._config.block.heading;
                        block.data.computedHeadingOffset = renderer._config.block.heading / 2;
                    },
                    "Picker": function () {
                        height += renderer._config.block.heading;
                        block.data.computedHeadingOffset = renderer._config.block.heading / 2;
                    }
                });
                return height;
            }
        })
        .each(function(block) {
            block.data.computedWidth = d3.select(this).attr("width");
            block.data.computedHeight = d3.select(this).attr("height");
        });
    blocks
        .select(".title")
        .attr({
            x: function (block) {
                var x = 0;
                pandora.polymorphic(block.model, {
                    "Action": function () { x = block.data.computedWidth / 2; },
                    "Getter": function () { x = renderer._config.block.padding; },
                    "Picker": function () { x = renderer._config.block.padding; }
                });
                return x;
            },
            y: this._config.block.padding
        });
    blocks.each(function (block) {
        pandora.polymorphicMethod(renderer, "updateBlock", block.model, block, d3.select(this));
    });
    this._renderPoints(blockPointsGroup);
};

cg.Renderer.prototype._updateBlockAction = function (model, block, element) {
    //
};

cg.Renderer.prototype._updateBlockGetter = function (model, block, element) {
    //
};

cg.Renderer.prototype._updateBlockPicker = function (model, block, element) {
    //
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