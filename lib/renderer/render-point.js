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
    pointCircle.attr("cursor", "pointer");
    var pointText = pointGroup.text(position.x + (point.isInput ? 10 : -10), position.y + 3, point.name);
    pointText.data('point', point);
    pointText.addClass("text");
    pointText.attr({
        "textAnchor": point.isInput ? "start" : "end",
        "cursor": "pointer"
    });
    if (connections.length === 0) {
        pointCircle.addClass("empty");
    }
    for (var connectionIndex = 0; connectionIndex < connections.length; ++connectionIndex) {
        var connection = connections[connectionIndex];
        if (connection.firstPoint.data.rendered && connection.secondPoint.data.rendered) {
            this.render(connections[connectionIndex], this._rootElement);
        }
    }
};

/**
 * Get relative point position in action
 * @param point {cg.Point}
 * @returns {cg.Vec2}
 * @private
 */
cg.Renderer.prototype._getPointRelativePosition = function (point) {
    return new cg.Vec2(
        (point.isInput ? this._style.action["padding"] : point.action.data.dirtyWidth - this._style.action["padding"]),
        this._style.action["heading"] + point.index * this._style.point["height"]
    );
};

/**
 * Get absolute point position
 * @param point {cg.Point}
 * @returns {cg.Vec2}
 * @private
 */
cg.Renderer.prototype._getPointAbsolutePosition = function (point) {
    var actionPosition = point.action.absolutePosition();
    return new cg.Vec2(
        actionPosition.x + (point.isInput ? this._style.action["padding"] : point.action.data.dirtyWidth - this._style.action["padding"]),
        actionPosition.y + this._style.action["heading"] + point.index * this._style.point["height"]
    );
};

