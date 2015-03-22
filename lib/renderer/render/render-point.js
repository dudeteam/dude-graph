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
    var renderer = this;
    var pointGroup = points
        .enter()
        .append("svg:g")
        .attr({
            "class": function (point) { return "point type-" + point.type + " " + (point.isInput ? "input" : "output"); }
        });
    var cursorPoint = null;
    var cursorConnections = [];
    var _getCursorPointConnections = function () {
        return renderer._cursorConnectionLayer
            .selectAll("path")
            .data(cursorConnections);
    };
    pointGroup
        .call(d3.behavior.drag()
            .on("dragstart", function () {
                var pointElement = d3.select(this);
                var point = pointElement.datum();
                cursorPoint = new cg.Renderer.Point(point, renderer._getPointAbsolutePosition(point));
                cursorConnections.push(new cg.Connection(cursorPoint, point));
                renderer._renderConnections(_getCursorPointConnections());
                pointElement.select("circle").classed("empty", false);
                pandora.preventCallback(d3.event.sourceEvent);
            })
            .on("drag", function () {
                cursorPoint.position.x += d3.event.dx;
                cursorPoint.position.y += d3.event.dy;
                cursorPoint.emit("move");
            })
            .on("dragend", function () {
                var connection = cursorConnections.pop();
                var r = 20;
                var pointArea = new pandora.Box2(cursorPoint.position.subtract(r / 2, r / 2), new pandora.Vec2(r, r));
                var newPoint = renderer._getNearestPointInArea(pointArea);
                if (newPoint !== null) {
                    if (newPoint.isInput !== cursorPoint.isInput) {
                        renderer._graph.emit("error", new cg.GraphError("Cannot link " + (newPoint.isInput ? "inputs" : "outputs") + " together"));
                    } else {
                        connection.replacePoint(newPoint);
                        renderer._graph.addConnection(connection);
                    }
                } else {
                    renderer._graph.emit("error", new cg.GraphError("No " + (cursorPoint.isInput ? "input" : "output") + " found around"));
                }
                renderer._renderConnections(renderer.getConnections());
                renderer._renderConnections(_getCursorPointConnections());
            })
        )
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
            "transform": function (point) {
                var value = this._getPointRelativePosition(point).toArray();
                pandora.polymorphic(point.block.model, {
                    "Action": pandora.defaultCallback,
                    "Getter": function () { value[1] = renderer._config.block.heading / 2; },
                    "Picker": function () { value[1] = renderer._config.block.heading / 2; }
                });
                return "translate(" + value + ")";
            }.bind(this)
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
            point.block.data.pointHeight = renderer._config.point.height;
            if (point.isInput) {
                point.block.data.maxInputWidth = Math.max(point.block.data.maxInputWidth, this.getBBox().width);
            } else {
                point.block.data.maxOutputWidth = Math.max(point.block.data.maxOutputWidth, this.getBBox().width);
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
    if (point.block.data.computedWidth === undefined) {
        return new pandora.Vec2();
    }
    return new pandora.Vec2(
        point.isInput ? this._config.block["padding"] : point.block.data.computedWidth - this._config.block.padding,
        point.block.data.computedHeadingOffset + point.index * this._config.point.height
    );
};

/**
 * Get absolute point position
 * @param point {cg.Point}
 * @returns {pandora.Vec2}
 * @private
 */
cg.Renderer.prototype._getPointAbsolutePosition = function (point) {
    if (point instanceof cg.Point) {
        return point.block.absolutePosition.add(this._getPointRelativePosition(point));
    }
    return point.position;
};