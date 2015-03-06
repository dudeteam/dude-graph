/**
 * Render the point.
 * @param point {cg.Point}
 * @param element {Object}
 * @private
 */
cg.Renderer.prototype._renderPoint = function (point, element) {
    var pointGroup = element.g();
    this._dataBinding(point, pointGroup);
    pointGroup.data('point', point);
    var position = this._getPointRelativePosition(point, pointGroup);
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
};

/**
 * Get relative
 * @param point {cg.Point}
 * @param pointGroup {Element}
 * @returns {cg.Vec2}
 * @private
 */
cg.Renderer.prototype._getPointRelativePosition = function (point, pointGroup) {
    return new cg.Vec2(
        (point.isInput ? this._style.action["padding"] : pointGroup.parent().getBBox().width - this._style.action["padding"]),
        this._style.action["heading"] + point.index * this._style.point["height"]
    );
};