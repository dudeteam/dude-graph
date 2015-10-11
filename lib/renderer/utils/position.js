/**
 * Get the text bounding box
 * Fixes a bug on chrome where the bounding box is zero when the element is not yet rendered
 * @param textElement {HTMLElement}
 * @return {[Number, Number]}
 * @private
 */
dudeGraph.Renderer.prototype._getTextBBox = function (textElement) {
    var bbox = textElement.getBBox();
    if (bbox.width === 0 && bbox.height === 0) {
        bbox = {
            width: textElement.textContent.length * 8,
            height: 24
        };
    }
    return [bbox.width, bbox.height];
};

/**
 * Returns an absolute position in the SVG from the relative position in the SVG container
 * It takes into account all transformations applied to the SVG
 * Example: renderer._getAbsolutePosition(d3.mouse(this));
 * @param {[Number, Number]} point
 * @return {[Number, Number]}
 * @private
 */
dudeGraph.Renderer.prototype._getAbsolutePosition = function (point) {
    this._svgPoint.x = point[0];
    this._svgPoint.y = point[1];
    var position = this._svgPoint.matrixTransform(this._d3Root.node().getCTM().inverse());
    return [position.x, position.y];
};

/**
 * Returns a relative position in the SVG container from absolute position in the SVG
 * It takes into account all transformations applied to the SVG
 * Example: renderer._getRelativePosition(d3.mouse(this));
 * @param {[Number, Number]} point
 * @return {[Number, Number]}
 * @private
 */
dudeGraph.Renderer.prototype._getRelativePosition = function (point) {
    this._svgPoint.x = point[0];
    this._svgPoint.y = point[1];
    var position = this._svgPoint.matrixTransform(this._d3Root.node().getScreenCTM().inverse());
    return [position.x, position.y];
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

/**
 * Computes the size of the given rendererBlock depending on its text or inputs/outputs
 * @param {dudeGraph.RendererBlock} rendererBlock
 * @private
 */
dudeGraph.Renderer.prototype._computeRendererBlockSize = function (rendererBlock) {
    var renderer = this;
    var d3Block = this._getD3NodesFromRendererNodes([rendererBlock]);
    var blockSize = renderer._getTextBBox(d3Block.select("text").node());
    var d3Points = d3Block.select(".cg-points").selectAll(".dude-graph-output, .dude-graph-input");
    var maxOutput = 0;
    var maxInput = 0;
    rendererBlock.size[0] = Math.max(rendererBlock.size[0], blockSize[0] + this._config.block.padding * 2);
    d3Points.each(function (rendererPoint) {
        var d3Point = d3.select(this);
        var textSize = renderer._getTextBBox(d3Point.select("text").node());
        if (rendererPoint.isOutput) {
            maxOutput = Math.max(maxOutput, textSize[0]);
        } else {
            maxInput = Math.max(maxInput, textSize[0]);
        }
    });
    rendererBlock.size[0] = Math.max(rendererBlock.size[0], maxOutput + maxInput + this._config.block.padding * 4 + this._config.point.radius * 2 + this._config.point.offset);
};

/**
 * Computes the position and the size of the given rendererGroup depending of its children
 * @param {dudeGraph.RendererGroup} rendererGroup
 * @private
 */
dudeGraph.Renderer.prototype._computeRendererGroupPositionAndSize = function (rendererGroup) {
    var renderer = this;
    if (rendererGroup.children.length > 0) {
        var size = renderer._getRendererNodesBoundingBox(rendererGroup.children);
        rendererGroup.position = [
            size[0][0] - renderer._config.group.padding,
            size[0][1] - renderer._config.group.padding - renderer._config.group.header];
        rendererGroup.size = [
            size[1][0] - size[0][0] + renderer._config.group.padding * 2,
            size[1][1] - size[0][1] + renderer._config.group.padding * 2 + renderer._config.group.header
        ];
    }
    rendererGroup.size = [
        Math.max(rendererGroup.size[0], renderer._config.group.size[0] + renderer._config.group.padding * 2),
        Math.max(rendererGroup.size[1], renderer._config.group.size[1] + renderer._config.group.padding * 2 + renderer._config.group.header)
    ];
    var d3Group = this._getD3NodesFromRendererNodes([rendererGroup]);
    rendererGroup.size[0] = Math.max(rendererGroup.size[0], d3Group.select("text").node().getBBox().width + renderer._config.group.padding * 2);
    (function computeRendererGroupParentPositionAndSize(rendererGroupParent) {
        if (rendererGroupParent) {
            renderer._computeRendererGroupPositionAndSize(rendererGroupParent);
            computeRendererGroupParentPositionAndSize(rendererGroupParent.parent);
        }
    })(rendererGroup.parent);
};

/**
 * Returns the rendererPoint position
 * @param {dudeGraph.RendererPoint} rendererPoint
 * @param {Boolean} relative - Whether the position is relative to the block position.
 * @return {[Number, Number]}
 * @private
 */
dudeGraph.Renderer.prototype._getRendererPointPosition = function (rendererPoint, relative) {
    var offsetX = relative ? 0 : rendererPoint.rendererBlock.position[0];
    var offsetY = relative ? 0 : rendererPoint.rendererBlock.position[1];
    var pointPositionGetter = this._pointPositionGetters[rendererPoint.rendererBlock.cgBlock.blockType];
    if (pointPositionGetter) {
        return pointPositionGetter.call(this, rendererPoint, offsetX, offsetY);
    } else {
        if (rendererPoint.isOutput) {
            return [
                offsetX + rendererPoint.rendererBlock.size[0] - this._config.block.padding,
                offsetY + this._config.block.header + this._config.point.height * rendererPoint.index
            ];
        } else {
            return [
                offsetX + this._config.block.padding,
                offsetY + this._config.block.header + this._config.point.height * rendererPoint.index
            ];
        }
    }
};

/**
 * Computes the connection path between two points
 * @param {[Number, Number]} point1
 * @param {[Number, Number]} point2
 * @return {String}
 * @private
 */
dudeGraph.Renderer.prototype._computeConnectionPath = function (point1, point2) {
    var step = 150;
    if (point1[0] - point2[0] < 0) {
        step += Math.max(-100, point1[0] - point2[0]);
    }
    return pandora.formatString("M{x},{y}C{x1},{y1} {x2},{y2} {x3},{y3}", {
        x: point1[0], y: point1[1],
        x1: point1[0] + step, y1: point1[1],
        x2: point2[0] - step, y2: point2[1],
        x3: point2[0], y3: point2[1]
    });
};