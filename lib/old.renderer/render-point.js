/**
 * Render the point.
 * @param point {cg.Point}
 * @param element {Object}
 * @private
 */
cg.Renderer.prototype._renderPoint = function (point, element) {
    var pointGroup = element.g();
    point.data.rendered = true;
    var connections = point.connections;
    var pointCircle = this._renderPointCircle(point, pointGroup);
    var tx = pointCircle.data("size") * 2 + this._config.point.padding;
    {
        // WEIRDEST FIX FIREFOX AND IE
        var firefoxBuTextOffset = pointGroup.text(point.isInput ? tx : -tx, pointCircle.data("size"), point.name);
        firefoxBuTextOffset.addClass("text");
        firefoxBuTextOffset.attr("text-anchor", point.isInput ? "start" : "end");
        var firefoxBuTextOffsetMask = pointGroup.rect(0, 0, 0, 0);
        firefoxBuTextOffsetMask.attr("fill", "black");
        firefoxBuTextOffset.attr("mask", firefoxBuTextOffsetMask);
        pointGroup.data("width", pointCircle.data("size") * 2 + firefoxBuTextOffset.getBBox().width + this._config.point.padding);
        firefoxBuTextOffset.remove();
        firefoxBuTextOffsetMask.remove();
        // END WEIRDEST FIX FIREFOX AN IE
    }
    var pointText = pointGroup.text(point.isInput ? tx : -tx, pointCircle.data("size"), point.name);
    pointText.addClass("text");
    pointText.attr("text-anchor", point.isInput ? "start" : "end");
    for (var connectionIndex = 0; connectionIndex < connections.length; ++connectionIndex) {
        var connection = connections[connectionIndex];
        if (connection.outputPoint.data.rendered && connection.inputPoint.data.rendered) {
            this.render(connections[connectionIndex], this._rootElement);
        }
    }

    return pointGroup;
};

/**
 * Render the point circle.
 * @param point {cg.Point}
 * @param element {Object}
 * @private
 */
cg.Renderer.prototype._renderPointCircle = function (point, element) {
    this._bindGraphData(point, element);
    element.addClass(point.isInput ? "input" : "output");
    var pointCircle = element.circle(0, 0, this._config.point["circle-size"]);
    pointCircle.data("size", this._config.point["circle-size"]);
    pointCircle.addClass("type-" + point.type);
    point.on("connection.add", function () {
        pointCircle.removeClass("empty");
    });
    point.on("connection.remove", function () {
        if (this.connections.length === 0) {
            pointCircle.addClass("empty");
        }
    });
    if (point.connections.length === 0) {
        pointCircle.addClass("empty");
    }
    interact(pointCircle.node)
        .origin(this._paper.node)
        .on('down', function (event) {
            pandora.preventCallback(event);
            if (event.altKey) {
                point.disconnect();
            }
        })
        .on('up', pandora.preventCallback)
        .draggable({
            onstart: function (event) {
                var position = this._positionToSvg(event.clientX, event.clientY);
                this._cursorPoint = new cg.Renderer.CursorPoint(point, position);
                this._cursorConnection = this.render(new cg.Connection(this._cursorPoint, point), this._rootElement);
                pointCircle.removeClass("empty");
            }.bind(this),
            onmove: function (event) {
                var position = this._positionToSvg(event.clientX, event.clientY);
                this._cursorPoint.position.assign(position);
                this._cursorPoint.emit("move");
            }.bind(this),
            onend: function () {
                this._rootElement.selectAll(this._cursorPoint.isInput ? ".input" : ".output").forEach(function (pointElement) {
                    var circle = pointElement.select("circle");
                    var destinationPoint = this.graphData(pointElement);
                    if (this._cursorPoint.position.collideCircle(this._getPointAbsolutePosition(destinationPoint), 5)) {
                        if (this._cursorPoint.type !== destinationPoint.type) {
                            this._graph.emit("error", new cg.GraphError("Cannot create connection between types {0} and {1}", this._cursorPoint.type, destinationPoint.type));
                        } else {
                            var connection = new cg.Connection(this._cursorPoint.sourcePoint, destinationPoint);
                            this._graph.addConnection(connection);
                        }
                    }
                }.bind(this));
                this._cursorPoint.sourcePoint.emit("connection.remove", null); // Remove the temporary connection
                this._cursorConnection.remove();
                this._cursorConnection = null;
                this._cursorPoint = null;
            }.bind(this)
        });

    return pointCircle;
};

/**
 * Get relative point position in action
 * @param point {cg.Point}
 * @returns {pandora.Vec2}
 * @private
 */
cg.Renderer.prototype._getPointRelativePosition = function (point) {
    return new pandora.Vec2(
        (point.isInput ? this._config.block["padding"] : point.action.data.computedWidth - this._config.block["padding"]),
        this._config.block["heading"] + point.index * this._config.point["height"]
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
        var actionPosition = point.action.absolutePosition;
        return new pandora.Vec2(
            actionPosition.x + (point.isInput ? this._config.block["padding"] : point.action.data.computedWidth - this._config.block["padding"]),
            actionPosition.y + point.action.data.computedHeadingOffset + point.index * this._config.point["height"]
        );
    }
    return point.position;
};