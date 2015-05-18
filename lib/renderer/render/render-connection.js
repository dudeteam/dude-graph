/**
 * Render connections.
 * @private
 */
cg.Renderer.prototype._renderConnections = function (connections) {
    this._updateGroupMasks();
    this._createConnections(connections);
    this._updateConnections(connections);
    this._removeConnections(connections);
};

/**
 * Create connections.
 * @param connections {d3.selection}
 * @private
 */
cg.Renderer.prototype._createConnections = function (connections) {
    var renderer = this;
    connections
        .enter()
        .append("svg:path")
        .attr({
            "class": function (connection) { return [
                "connection",
                "type-filter-fill",
                "type-" + connection.outputPoint.type
            ].join(" "); },
            "style": "stroke-width: 2px;"
        })
        .on("mousedown", function () {
            var connectionElement = d3.select(this);
            connectionElement.classed("selected", !connectionElement.classed("selected"));
            pandora.preventCallback(d3.event);
        })
        .each(function (connection) {
            var updatePath = renderer._updateConnections.bind(renderer, d3.select(this));
            if (connection.outputPoint instanceof cg.Point) {
                connection.outputPoint.block.on("move", updatePath);
            } else {
                connection.outputPoint.on("move", updatePath);
            }
            if (connection.inputPoint instanceof cg.Point) {
                connection.inputPoint.block.on("move", updatePath);
            } else {
                connection.inputPoint.on("move", updatePath);
            }
        });
};

/**
 * Update connections.
 * @param connections {d3.selection}
 * @private
 */
cg.Renderer.prototype._updateConnections = function (connections) {
    connections
        .attr({
            "d": function (connection) {
                var p1 = this._getPointAbsolutePosition(connection.outputPoint);
                var p2 = this._getPointAbsolutePosition(connection.inputPoint);
                var step = Math.max(0.5 * (p1.x - p2.x) + 200, 50);
                return pandora.formatString("M{x},{y}C{x1},{y1} {x2},{y2} {x3},{y3}", {
                    x: p1.x, y: p1.y,
                    x1: p1.x + step, y1: p1.y,
                    x2: p2.x - step, y2: p2.y,
                    x3: p2.x, y3: p2.y
                });
            }.bind(this)
        });
};

/**
 * Remove connections.
 * @param connections {d3.selection}
 * @private
 */
cg.Renderer.prototype._removeConnections = function (connections) {
    connections
        .exit()
        .remove();
};