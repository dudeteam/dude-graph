/**
 * Return SVG offset origin.
 * @return {Vec2}
 * @private
 */
cg.Renderer.prototype._svgOrigin = function() {
    var svgBoundingRect = this._svg.node().getBoundingClientRect();
    return new pandora.Vec2(svgBoundingRect.left, svgBoundingRect.top);
};

/**
 * Return an event point in zoomed SVG coordinates.
 * @param x {Number}
 * @param y {Number}
 * @param ignoreOrigin {Boolean?} Ignore the SVG offset
 * @return {pandora.Vec2}
 * @private
 */
cg.Renderer.prototype._zoomedSvgPosition = function (x, y, ignoreOrigin) {
    if (!ignoreOrigin) {
        var svgOrigin = this._svgOrigin();
        this._svgPoint.x = x - svgOrigin.x;
        this._svgPoint.y = y - svgOrigin.y;
    } else {
        this._svgPoint.x = x;
        this._svgPoint.y = y;
    }
    var position = this._svgPoint.matrixTransform(this._rootGroup.node().getCTM().inverse());
    return new pandora.Vec2(position);
};

/**
 * Utility to send a d3 selection to front.
 * @returns {d3.selection}
 */
d3.selection.prototype.moveToFront = function () {
    return this.each(function () {
        this.parentNode.appendChild(this);
    });
};