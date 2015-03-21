/**
 * Return the d3 origin used for transformation.
 * @return {pandora.Vec2}
 * @private
 */
cg.Renderer.prototype._getSvgOrigin = function () {
    var svgBoundingRect = this._svg.node().getBoundingClientRect();
    return this._getSvgPosition(d3.event.x - svgBoundingRect.left, d3.event.y - svgBoundingRect.top);
};

/**
 * Return an event point in SVG coordinates.
 * Note that the returned Vector must be cloned if you want to embed it in another object.
 * @param x
 * @param y
 * @return {pandora.Vec2}
 * @private
 */
cg.Renderer.prototype._getSvgPosition = function (x, y) {
    this._svgPoint.x = x;
    this._svgPoint.y = y;
    var position = this._svgPoint.matrixTransform(this._rootGroup.node().getCTM().inverse());
    return new pandora.Vec2(position); // TODO: optimize this as we don't need to allocate.
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