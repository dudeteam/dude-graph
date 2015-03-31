/**
 * Cursor connections.
 * @type {Array<cg.Connection>}
 */
var cursorConnections = [];

/**
 * Next cursor connection id for data-binding.
 * @type {number}
 */
var nextCursorConnectionId = 0;

/**
 * Add the cursor connection to the list of cursor connections drawn on the screen.
 * @param cursorConnection {cg.Connection}
 * @return {cg.Connection}
 */
var addCursorConnection = function (cursorConnection) {
    cursorConnection.data.cursorConnectionId = nextCursorConnectionId++;
    cursorConnections.push(cursorConnection);
    return cursorConnection;
};

/**
 * Remove the cursor connection to the list of cursor connections drawn on the screen.
 * @param cursorConnection {cg.Connection}
 */
var removeCursorConnection = function (cursorConnection) {
    delete cursorConnection.data.cursorConnectionId;
    return cursorConnections.splice(cursorConnections.indexOf(cursorConnection), 1)[0];
};

/**
 * Return the list of cursor connections drawn on the screen.
 * @return {d3.selection}
 * @private
 */
var getCursorPointConnections = function () {
    return renderer._cursorConnectionLayer
        .selectAll(".connection")
        .data(cursorConnections, function (cursorConnection) {
            return cursorConnection.data.cursorConnectionId;
        });
};

/**
 * Render the block points.
 * @param blockPointsGroup {d3.selection}
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
 * Create the points.
 * @param points {d3.selection}
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
    pointGroup
        .call(d3.behavior.drag()
            .origin(function (point) {
                return renderer._getPointAbsolutePosition(point);
            })
            .on("dragstart", function () {
                var pointElement = d3.select(this);
                var point = pointElement.datum();
                if (d3.event.sourceEvent.altKey && point.connections.length > 0) {
                    point.disconnect();
                    return;
                }
                if (point.data.cursorPoint) {
                    cursorConnections.splice(cursorConnections.indexOf(point.data.cursorConnection), 1);
                }
                var touchPosition = renderer._getZoomedTouchPosition(d3.event.sourceEvent);
                point.data.cursorPoint = new cg.Renderer.Point(point, touchPosition);
                point.data.cursorConnection = new cg.Connection(point.data.cursorPoint, point);
                addCursorConnection(point.data.cursorConnection);
                renderer._renderConnections(getCursorPointConnections());
                pandora.preventCallback(d3.event.sourceEvent);
            })
            .on("drag", function () {
                var point = d3.select(this).datum();
                point.data.cursorPoint.position.x += d3.event.dx;
                point.data.cursorPoint.position.y += d3.event.dy;
                point.data.cursorPoint.emit("move");
            })
            .on("dragend", function () {
                var r = 20;
                var point = d3.select(this).datum();
                var connection = removeCursorConnection(point.data.cursorConnection);
                var pointArea = new pandora.Box2(point.data.cursorPoint.position.subtract(r / 2, r / 2), new pandora.Vec2(r, r));
                var newPoint = renderer._getNearestPointInArea(pointArea);
                if (newPoint !== null && connection.replacePoint(point.data.cursorPoint, newPoint)) {
                    renderer._graph.addConnection(connection);
                } else {
                    renderer._graph.emit("error", new cg.GraphError("No " + (point.data.cursorPoint.isInput ? "input" : "output") + " found around"));
                }
                renderer._removeConnections(getCursorPointConnections());
                delete point.data.cursorPoint;
                delete point.data.cursorConnection;
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
            var updatePoint = renderer._updatePoints.bind(renderer, d3.select(this));
            point.on("connection.add", updatePoint);
            point.on("connection.remove", updatePoint);
        });
};

/**
 * Update the points.
 * @param points {d3.selection}
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
    var circles = points
        .select(".circle")
        .attr({
            "r": this._config.point["circle-size"],
            "x": 0,
            "y" : 0
        });
    circles.classed("empty", function (point) { return !point.connections.length; });
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
 * Remove the points.
 * @param points {d3.selection}
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