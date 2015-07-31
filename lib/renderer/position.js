/**
 * Returns an absolute position in the SVG from the relative position in the SVG container
 * It takes into account all transformations applied to the SVG
 * Example: renderer._getAbsolutePosition(d3.mouse(this));
 * @param point {[Number, Number]}
 * @return {[Number, Number]}
 * @private
 */
cg.Renderer.prototype._getAbsolutePosition = function (point) {
    this._svgPoint.x = point[0];
    this._svgPoint.y = point[1];
    var position = this._svgPoint.matrixTransform(this._rootSvg.node().getCTM().inverse());
    return [position.x, position.y];
};

/**
 * Returns a relative position in the SVG container from absolute position in the SVG
 * It takes into account all transformations applied to the SVG
 * Example: renderer._getRelativePosition(d3.mouse(this));
 * @param point {[Number, Number]}
 * @return {[Number, Number]}
 * @private
 */
cg.Renderer.prototype._getRelativePosition = function (point) {
    this._svgPoint.x = point[0];
    this._svgPoint.y = point[1];
    var position = this._svgPoint.matrixTransform(this._rootSvg.node().getScreenCTM().inverse());
    return [position.x, position.y];
};

/**
 * Returns the bounding box for all the given renderer nodes
 * @param rendererNodes {Array<cg.RendererNode>}
 * @returns {[[Number, Number], [Number, Number]]}
 * @private
 */
cg.Renderer.prototype._getRendererNodesBoundingBox = function (rendererNodes) {
    var topLeft = null;
    var bottomRight = null;
    pandora.forEach(rendererNodes, function (rendererNode) {
        if (!topLeft) {
            topLeft = new pandora.Vec2(rendererNode.position);
        }
        if (!bottomRight) {
            bottomRight = new pandora.Vec2(rendererNode.position[0] + rendererNode.size[0], rendererNode.position[1] + rendererNode.size[1]);
        }
        topLeft.x = Math.min(rendererNode.position[0], topLeft.x);
        topLeft.y = Math.min(rendererNode.position[1], topLeft.y);
        bottomRight.x = Math.max(bottomRight.x, rendererNode.position[0] + rendererNode.size[0]);
        bottomRight.y = Math.max(bottomRight.y, rendererNode.position[1] + rendererNode.size[1]);
    });
    return [topLeft.toArray(), bottomRight.toArray()];
};