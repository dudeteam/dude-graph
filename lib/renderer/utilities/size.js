/**
 * Returns the text bounding box, prediction can be done accurately while using a monospace font
 * Always use a monospace font for fast prediction of the text size
 * Unless you'd like to deal with FOUT and getBBox...
 * @param {String|d3.selection} text
 */
dudeGraph.Renderer.prototype.textBoundingBox = function (text) {
    if (text instanceof d3.selection) {
        // Use this for perfect text bounding box
        // var boundingBox = text.node().getBBox();
        // return [boundingBox.width, boundingBox.height];
        text = text.text();
    }
    return [text.length * 8, 17];
};

/**
 * Returns the rect(top left, bottom right) for all the given renderNodes
 * @param {Array<dudeGraph.RenderNode>} renderNodes
 * @returns {[[Number, Number], [Number, Number]]}
 */
dudeGraph.Renderer.prototype.renderNodesRect = function (renderNodes) {
    var topLeft = [Infinity, Infinity];
    var bottomRight = [-Infinity, -Infinity];
    _.forEach(renderNodes, function (renderNode) {
        topLeft[0] = Math.min(topLeft[0], renderNode.nodePosition[0]);
        topLeft[1] = Math.min(topLeft[1], renderNode.nodePosition[1]);
        bottomRight[0] = Math.max(bottomRight[0], renderNode.nodePosition[0] + renderNode.nodeSize[0]);
        bottomRight[1] = Math.max(bottomRight[1], renderNode.nodePosition[1] + renderNode.nodeSize[1]);
    });
    if (topLeft === [Infinity, Infinity] || bottomRight === [-Infinity, -Infinity]) {
        return [[0, 0], [0, 0]];
    }
    return [topLeft, bottomRight];
};

/**
 * Returns world coordinates from screen coordinates
 * Example: renderer._getAbsolutePosition(d3.mouse(this));
 * @param {[Number, Number]} point
 * @return {[Number, Number]}
 */
dudeGraph.Renderer.prototype.screenToWorld = function (point) {
    this._svgPoint.x = point[0];
    this._svgPoint.y = point[1];
    var position = this._svgPoint.matrixTransform(this._d3Root.node().getCTM().inverse());
    return [position.x, position.y];
};