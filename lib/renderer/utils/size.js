/**
 * Returns the text width and height
 * @param {String|d3.selection} text
 * @return {Array<Number>}
 */
dudeGraph.Renderer.prototype.measureText = function (text) {
    if (text instanceof d3.selection) {
        // Use this for perfect text bounding box
        // var boundingBox = text.node().getBBox();
        // return [boundingBox.width, boundingBox.height];
        text = text.text();
    }
    return [text.length * 8, 17]; // Inconsolata font prediction
};

/**
 * Returns the rect (top left, bottom right) for all the given renderNodes
 * @param {Array<dudeGraph.RenderNode>} renderNodes
 * @param {Boolean} [nullable=false] - Whether to return null or [[0, 0], [0, 0]]
 * @returns {Array<Array<Number>>}
 */
dudeGraph.Renderer.prototype.renderNodesBoundingRect = function (renderNodes, nullable) {
    var topLeft = [Infinity, Infinity];
    var bottomRight = [-Infinity, -Infinity];
    _.forEach(renderNodes, function (renderNode) {
        topLeft[0] = Math.min(topLeft[0], renderNode.nodePosition[0]);
        topLeft[1] = Math.min(topLeft[1], renderNode.nodePosition[1]);
        bottomRight[0] = Math.max(bottomRight[0], renderNode.nodePosition[0] + renderNode.nodeSize[0]);
        bottomRight[1] = Math.max(bottomRight[1], renderNode.nodePosition[1] + renderNode.nodeSize[1]);
    });
    if (topLeft[0] === Infinity || bottomRight[0] === -Infinity) {
        return nullable ? null : [[0, 0], [0, 0]];
    }
    return [topLeft, bottomRight];
};

/**
 * Returns world coordinates from screen coordinates
 * Example: renderer.screenToWorld(d3.mouse(this));
 * @param {Array<Number>} point
 * @return {Array<Number>}
 */
dudeGraph.Renderer.prototype.screenToWorld = function (point) {
    this._svgPoint.x = point[0];
    this._svgPoint.y = point[1];
    var position = this._svgPoint.matrixTransform(this._d3Root.node().getCTM().inverse());
    return [position.x, position.y];
};