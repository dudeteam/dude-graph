/**
 * Render the point.
 * @private
 */
cg.Renderer.prototype._renderPoints = function (blockPointsGroup) {
    var points = blockPointsGroup
        .selectAll("g")
        .data(function (block) { return block.inputs.concat(block.outputs); });
    this._createPoints(points);
    this._updatePoints(points);
    this._removePoints(points);
};

/**
 *
 * @param points
 * @private
 */
cg.Renderer.prototype._createPoints = function (points) {
    var pointGroup = points
        .enter()
        .append("svg:g")
        .attr({
            "class": function (point) { return "point type-" + point.type + " " + (point.isInput ? "input" : "output"); }
        });
    pointGroup
        .each(function(point) {
            d3.select(this)
                .append("svg:circle")
                .attr({
                    "class": "circle"
                });
            pandora.polymorphic(point.block.model, {
                "Action": function () {
                    d3.select(this)
                        .append("svg:text")
                        .attr({
                            "class": "description",
                            "text-anchor": function (point) { return point.isInput ? "start" : "end"; }
                        });
                }.bind(this),
                "_": pandora.defaultCallback
            });
        });
};

/**
 *
 * @param points
 * @private
 */
cg.Renderer.prototype._updatePoints = function (points) {
    var renderer = this;
    points
        .attr({
            "transform": function (point) { return "translate(" + this._getPointRelativePosition(point).toArray() + ")"}.bind(this)
        });
    points
        .select(".circle")
        .attr({
            "class": function(point) { return point.connections.length ? "" : "empty"; },
            "r": this._config.point["circle-size"],
            "x": 0,
            "y" : 0
        });
    points
        .select(".description")
        .text(function(point) { return point.name; })
        .attr({
            "x": function(point) { return (point.isInput ? 1 : -1) * (this._config.point["circle-size"] * 2 + this._config.point.padding); }.bind(this),
            "y": this._config.point["circle-size"]
        });
    points
        .each(function(point) {
            if (point.isInput) {
                point.block.data.maxInputWidth = Math.max(point.block.data.maxInputWidth, this.getBBox().width);
            } else {
                point.block.data.maxOutputWidth = Math.max(point.block.data.maxOutputWidth, this.getBBox().width);
            }
            if (point.isInput && point.block.inputs.length > point.block.outputs.length) {
                point.block.data.minInputHeight += this.getBBox().height + renderer._config.point.padding;
            } else if (point.block.outputs.length > point.block.inputs.length) {
                point.block.data.minInputHeight += this.getBBox().height + renderer._config.point.padding;
            }
        });
};

/**
 *
 * @param points
 * @private
 */
cg.Renderer.prototype._removePoints = function (points) {
    points
        .exit()
        .remove();
};

/**
 * Get relative point position in action
 * @param point {cg.Point}
 * @returns {pandora.Vec2}
 * @private
 */
cg.Renderer.prototype._getPointRelativePosition = function (point) {
    return new pandora.Vec2(
        (point.isInput ? this._config.block["padding"] : (point.block.data.computedWidth ? point.block.data.computedWidth - this._config.block["padding"] : this._config.block["padding"])),
        this._config.block["heading"] + point.index * this._config.point["height"]
    );
};