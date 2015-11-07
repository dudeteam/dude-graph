/**
 * Returns the bounding box of the given element
 * @param {HTMLElement} element
 * @returns {{x: Number, y: Number, width: Number, height: Number}}
 * @private
 */
dudeGraph.Renderer.prototype._getBBox = function (element) {
    var boundingBox = {"x": 0, "y": 0, "width": 0, "height": 0};
    try {
        var realBoundingBox = element.getBBox();
        boundingBox = {
            "x": realBoundingBox.x,
            "y": realBoundingBox.y,
            "width": realBoundingBox.width,
            "height": realBoundingBox.height
        };
    } catch (e) {
        // Fixes a bug in Firefox where getBBox throws NS_ERROR_FAILURE
        var realBoundingRect = element.getBoundingClientRect();
        boundingBox = {
            "x": realBoundingRect.left,
            "y": realBoundingRect.top,
            "width": realBoundingRect.right - realBoundingRect.left,
            "height": realBoundingRect.bottom - realBoundingRect.top
        };
    }
    return boundingBox;
};

/**
 * Get the text bounding box
 * Fixes a bug on chrome where the bounding box is zero when the element is not yet rendered
 * @param textElement {HTMLElement}
 * @returns {{x: Number, y: Number, width: Number, height: Number}}
 * @private
 */
dudeGraph.Renderer.prototype._getTextBBox = function (textElement) {
    var boundingBox = this._getBBox(textElement);
    if (boundingBox.width === 0 && boundingBox.height === 0) {
        // Fixes a bug on chrome where the bounding box is zero when the element is not yet rendered
        boundingBox.width = textElement.textContent.length * 8;
        boundingBox.height = 24;
    }
    return boundingBox;
};

/**
 * Returns the bounding box for all the given rendererNodes
 * @param {Array<dudeGraph.RendererNode>} rendererNodes
 * @returns {[[Number, Number], [Number, Number]]}
 * @private
 */
dudeGraph.Renderer.prototype._getRendererNodesBoundingBox = function (rendererNodes) {
    var topLeft = null;
    var bottomRight = null;
    _.forEach(rendererNodes, function (rendererNode) {
        if (topLeft === null) {
            topLeft = [rendererNode.position[0], rendererNode.position[1]];
        }
        if (bottomRight === null) {
            bottomRight = [topLeft[0] + rendererNode.size[0], topLeft[1] + rendererNode.size[1]];
        }
        topLeft[0] = Math.min(topLeft[0], rendererNode.position[0]);
        topLeft[1] = Math.min(topLeft[1], rendererNode.position[1]);
        bottomRight[0] = Math.max(bottomRight[0], rendererNode.position[0] + rendererNode.size[0]);
        bottomRight[1] = Math.max(bottomRight[1], rendererNode.position[1] + rendererNode.size[1]);
    });
    return [topLeft, bottomRight];
};