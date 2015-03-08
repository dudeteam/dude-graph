/**
 * Render the point.
 * @param point {cg.Point}
 * @param element {Object}
 * @private
 */
cg.Renderer.prototype._renderPoint = function (point, element) {
    var pointGroup = element.g();
    point.data.rendered = true;
    this._dataBinding(point, pointGroup);
    pointGroup.data('point', point);
    var position = this._getPointRelativePosition(point);
    var connections = point.connections;
    pointGroup.addClass(point.isInput ? "input" : "output");
    var pointCircle = pointGroup.circle(position.x, position.y, 3);
    pointCircle.data('point', point);
    pointCircle.addClass("type-" + point.type);
    var pointText = pointGroup.text(position.x + (point.isInput ? 10 : -10), position.y + 3, point.name);
    pointText.data('point', point);
    pointText.addClass("text");
    pointText.attr("textAnchor", point.isInput ? "start" : "end");
    if (connections.length === 0) {
        pointCircle.addClass("empty");
    }
    for (var connectionIndex = 0; connectionIndex < connections.length; ++connectionIndex) {
        var connection = connections[connectionIndex];
        if (connection.outputPoint.data.rendered && connection.inputPoint.data.rendered) {
            this.render(connections[connectionIndex], this._rootElement);
        }
    }
    pointGroup.mousedown(function (e) {
        if (e.altKey) {
            console.log("remove connection");
        } else {
            this._cursorPoint = new cg.Renderer.CursorPoint(point, this._mousePosition.clone());
            this._cursorConnection = this.render(new cg.Connection(this._cursorPoint, point), this._rootElement);
            cg.preventCallback(e);
        }
    }.bind(this));
};

/**
 * Get relative point position in action
 * @param point {cg.Point}
 * @returns {cg.Vec2}
 * @private
 */
cg.Renderer.prototype._getPointRelativePosition = function (point) {
    return new cg.Vec2(
        (point.isInput ? this._config.action["padding"] : point.action.data.computedWidth - this._config.action["padding"]),
        this._config.action["heading"] + point.index * this._config.point["height"]
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
        var actionPosition = point.action.absolutePosition();
        return new cg.Vec2(
            actionPosition.x + (point.isInput ? this._config.action["padding"] : point.action.data.computedWidth - this._config.action["padding"]),
            actionPosition.y + this._config.action["heading"] + point.index * this._config.point["height"]
        );
    }
    return point.position;
};
