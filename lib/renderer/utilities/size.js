/**
 * Returns the text bounding box, prediction can be done accurately while using a monospace font
 * Always use a monospace font for fast prediction of the text size, unless you'd like to deal with FOUT and getBBox...
 * @param {String|d3.selection} text
 */
dudeGraph.Renderer.prototype.textBoundingBox = function (text) {
    if (text instanceof d3.selection) {
        // Use this for perfect text bounding box
        var boundingBox = text.node().getBBox();
        return [boundingBox.width, boundingBox.height];
        // text = text.text();
    }
    return [text.length * 8, 17];
};

/**
 * Returns world coordinates from screen coordinates
 * Example: renderer._getAbsolutePosition(d3.mouse(this));
 * @param {[Number, Number]} point
 * @return {[Number, Number]}
 * @private
 */
dudeGraph.Renderer.prototype._screenToWorld = function (point) {
    this._svgPoint.x = point[0];
    this._svgPoint.y = point[1];
    var position = this._svgPoint.matrixTransform(this._d3Root.node().getCTM().inverse());
    return [position.x, position.y];
};