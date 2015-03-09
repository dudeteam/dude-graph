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
    var tx = pointCircle.data("size") * 2 + this._config.point["padding"];
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
    this._setNode(point, element);
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
    pointCircle.mousedown(function (e) {
        if (e.altKey) {
            point.disconnect();
        } else {
            this._cursorPoint = new cg.Renderer.CursorPoint(point, this._mousePosition.clone());
            this._cursorConnection = this.render(new cg.Connection(this._cursorPoint, point), this._rootElement);
            pointCircle.removeClass("empty");
        }
        cg.preventCallback(e);
    }.bind(this));
    return pointCircle;
};

/**
 * Get relative point position in action
 * @param point {cg.Point}
 * @returns {cg.Vec2}
 * @private
 */
cg.Renderer.prototype._getPointRelativePosition = function (point) {
    return new cg.Vec2(
        (point.isInput ? this._config.block["padding"] : point.action.data.computedWidth - this._config.block["padding"]),
        this._config.block["heading"] + point.index * this._config.point["height"]
    );
};

/**
 * Get absolute point position
 * @param point {cg.Point}
 * @returns {cg.Vec2}
 * @private
 */
cg.Renderer.prototype._getPointAbsolutePosition = function (point) {
    if (point instanceof cg.Point) {
        var actionPosition = point.action.absolutePosition;
        return new cg.Vec2(
            actionPosition.x + (point.isInput ? this._config.block["padding"] : point.action.data.computedWidth - this._config.block["padding"]),
            actionPosition.y + point.action.data.computedHeadingOffset + point.index * this._config.point["height"]
        );
    }
    return point.position;
};
