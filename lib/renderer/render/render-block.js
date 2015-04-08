/**
 * Render blocks.
 * @private
 */
cg.Renderer.prototype._renderBlocks = function (blocks) {
    this._createBlocks(blocks);
    this._heavyUpdateBlocks(blocks);
    this._removeBlocks(blocks);
};

/**
 * Create blocks.
 * @param blocks {d3.selection}
 * @private
 */
cg.Renderer.prototype._createBlocks = function (blocks) {
    var renderer = this;
    var createdBlocks = blocks
        .enter()
        .append("svg:g")
        .attr({
            "class": "block"
        });
    createdBlocks
        .append("svg:rect")
        .attr({
            "class": "background"
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
        .call(this._doubleClick())
        .call(this._renderDrag())
        .each(function (block) {
            pandora.polymorphicMethod(renderer, "createBlock", block.model, block, d3.select(this));
            block.on("move", renderer._lightUpdateBlocks.bind(renderer, d3.select(this)));
            block.on("update", renderer._heavyUpdateBlocks.bind(renderer, d3.select(this)));
            block.on("reorder", d3.selection.prototype.moveToFront.bind(d3.select(this)));
        });
};

/**
 * Create the action block.
 * @param model {cg.Model}
 * @param block {cg.Block}
 * @param element {d3.selection}
 * @private
 */
cg.Renderer.prototype._createBlockAction = function (model, block, element) {
    element.classed(model.type, true);
    element.append("svg:text").attr({
        "class": "title",
        "text-anchor": "middle",
        "alignment-baseline": "baseline"
    });
};

/**
 * Create the getter block.
 * @param model {cg.Model}
 * @param block {cg.Block}
 * @param element {d3.selection}
 * @private
 */
cg.Renderer.prototype._createBlockGetter = function (model, block, element) {
    element.classed(model.type, true);
    element.classed("type-" + block.model.valueType, true);
    element.append("svg:text").attr({
        "class": "title",
        "text-anchor": "start",
        "alignment-baseline": "middle"
    });
};

/**
 * Create the picker block.
 * @param model {cg.Model}
 * @param block {cg.Block}
 * @param element {d3.selection}
 * @private
 */
cg.Renderer.prototype._createBlockPicker = function (model, block, element) {
    element.classed(model.type, true);
    element.classed("type-" + block.model.valueType, true);
    var className = pandora.camelcase(block.model.valueType, "-");
    if (this["_createPicker" + className] === undefined) {
        this.emit("error", new pandora.MissingOverloadError("createPicker" + className, "Renderer"));
    } else {
        this["_createPicker" + className](block, element);
    }
};

/**
 * Update blocks position.
 * @param blocks {d3.selection}
 * @private
 */
cg.Renderer.prototype._lightUpdateBlocks = function (blocks) {
    blocks
        .attr("transform", function (block) { return "translate(" + block.absolutePosition.toArray() + ")"; });
};

/**
 * Update blocks.
 * @param blocks {d3.selection}
 * @private
 */
cg.Renderer.prototype._heavyUpdateBlocks = function (blocks) {
    var renderer = this;
    blocks
        .attr("transform", function (block) { return "translate(" + block.absolutePosition.toArray() + ")"; });
    var blockPointsGroup = blocks
        .select(".points");
    this._renderPoints(blockPointsGroup);
    blocks
        .select(".background")
        .attr({
            rx: function (block) { return this._config[block.model.type].borderRadius; }.bind(this),
            ry: function (block) { return this._config[block.model.type].borderRadius; }.bind(this),
            x: 0,
            y: 0
        });
    blocks.each(function (block) {
        var element = d3.select(this);
        pandora.polymorphicMethod(renderer, "updateBlock", block.model, block, element);
        element.select(".background").attr({
            width: block.data.computedWidth,
            height: block.data.computedHeight
        });
    });
    this._renderPoints(blockPointsGroup);
};

/**
 * Update the action block.
 * @param model {cg.Model}
 * @param block {cg.Block}
 * @param element {d3.selection}
 * @private
 */
cg.Renderer.prototype._updateBlockAction = function (model, block, element) {
    element.select(".title").text(block._name);
    block.data.computedWidth = renderer._config.block.padding * 2;
    block.data.computedWidth += Math.max(
        element.select(".title").node().getBBox().width,
        block.data.maxInputWidth + block.data.maxOutputWidth + renderer._config.block.centerSpacing
    );
    block.data.computedHeight = renderer._config.block.heading;
    block.data.computedHeight += block.data.pointHeight * Math.max(block.inputs.length, block.outputs.length);
    block.data.computedHeadingOffset = renderer._config.block.heading;
    element.select(".title").attr({x: block.data.computedWidth / 2, y: this._config.block.padding});
};

/**
 * Update the getter block.
 * @param model {cg.Model}
 * @param block {cg.Block}
 * @param element {d3.selection}
 * @private
 */
cg.Renderer.prototype._updateBlockGetter = function (model, block, element) {
    element.select(".title")
        .attr({x: this._config.block.padding, y: this._config.block.padding})
        .text(block._name);
    block.data.computedWidth = renderer._config.block.padding * 2;
    block.data.computedWidth += element.select(".title").node().getBBox().width;
    block.data.computedWidth += renderer._config.block.padding + renderer._config.point['circle-size'];
    block.data.computedHeight = renderer._config.block.heading;
    block.data.computedHeadingOffset = block.data.computedHeight / 2;
};

/**
 * Update the picker block.
 * @param model {cg.Model}
 * @param block {cg.Block}
 * @param element {d3.selection}
 * @private
 */
cg.Renderer.prototype._updateBlockPicker = function (model, block, element) {
    block.data.computedWidth = renderer._config.block.padding * 2;
    var className = pandora.camelcase(block.model.valueType, "-");
    if (this["_updatePicker" + className] === undefined) {
        this.emit("error", new pandora.MissingOverloadError("updatePicker" + className, "Renderer"));
    } else {
        this["_updatePicker" + className](block, element);
    }
    block.data.computedWidth += renderer._config.block.padding + renderer._config.point['circle-size'];
    block.data.computedHeight = renderer._config.block.heading;
    block.data.computedHeadingOffset = block.data.computedHeight / 2;
};

/**
 * Remove blocks.
 * @param blocks {d3.selection}
 * @private
 */
cg.Renderer.prototype._removeBlocks = function (blocks) {
    blocks
        .exit()
        .remove();
};