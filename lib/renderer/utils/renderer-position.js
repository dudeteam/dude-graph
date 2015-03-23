/**
 * Return an event point in SVG coordinates.
 * @param x
 * @param y
 * @return {pandora.Vec2}
 * @private
 */
cg.Renderer.prototype._getSvgPosition = function (x, y) {
    var svgBoundingRect = this._svg.node().getBoundingClientRect();
    this._svgPoint.x = x - svgBoundingRect.left;
    this._svgPoint.y = y - svgBoundingRect.top;
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