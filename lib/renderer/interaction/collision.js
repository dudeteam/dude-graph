/**
 * Creates the renderBlocks collision quadtree
 * @private
 */
dudeGraph.Renderer.prototype._createRenderBlocksCollisions = function () {
    this._renderBlocksQuadtree = d3.geom.quadtree()
        .x(function (renderBlock) {
            return renderBlock.nodePosition[0];
        })
        .y(function (renderBlock) {
            return renderBlock.nodePosition[1];
        })(this._renderBlocks);
};

/**
 * Creates the renderPoints collision quadtree
 * @private
 */
dudeGraph.Renderer.prototype._createRenderPointsCollisions = function () {
    var renderPoints = [];
    _.forEach(this._renderBlocks, function (rendererBlock) {
        renderPoints = renderPoints.concat(rendererBlock.renderPoints);
    });
    this._renderPointsQuadtree = d3.geom.quadtree()
        .x(function (renderPoint) {
            return renderPoint.pointAbsolutePosition[0];
        })
        .y(function (renderPoint) {
            return renderPoint.pointAbsolutePosition[1];
        })(renderPoints);
};

/**
 * Creates the renderGroups collision quadtree
 * @private
 */
dudeGraph.Renderer.prototype._createRenderGroupsCollisions = function () {
    this._renderGroupsQuadtree = d3.geom.quadtree()
        .x(function (renderGroup) {
            return renderGroup.nodePosition[0];
        })
        .y(function (renderGroup) {
            return renderGroup.nodePosition[1];
        })(this._renderGroups);
};

/**
 * Returns all RendererNodes overlapping the given area
 * @param {Array<Array<Number>>} rect
 * @return {Array<dudeGraph.RenderBlock>}
 */
dudeGraph.Renderer.prototype.nearestRenderBlocks = function (rect) {
    this._createRenderBlocksCollisions(); // TODO: Update the quadtree only when needed
    var renderBlocks = [];
    this._renderBlocksQuadtree.visit(function (d3QuadtreeNode, x1, y1, x2, y2) {
        var renderBlock = d3QuadtreeNode.point;
        if (renderBlock) {
            var bounds = [
                renderBlock.nodePosition[0],
                renderBlock.nodePosition[1],
                renderBlock.nodePosition[0] + renderBlock.nodeSize[0],
                renderBlock.nodePosition[1] + renderBlock.nodeSize[1]
            ];
            if (!(rect[0][0] > bounds[2] || rect[0][1] > bounds[3] || rect[1][0] < bounds[0] || rect[1][1] < bounds[1])) {
                renderBlocks.push(renderBlock);
            }
        }
        return x1 - 50 >= rect[1][0] || y1 - 35 >= rect[1][1] || x2 + 50 < rect[0][0] || y2 + 35 < rect[0][1];
    });
    return renderBlocks;
};

/**
 * Returns the best renderGroup capable of containing the given renderBlock
 * @param {dudeGraph.RenderBlock} renderBlock
 * @returns {dudeGraph.RenderGroup|null}
 */
dudeGraph.Renderer.prototype.nearestRenderGroup = function (renderBlock) {
    // TODO: Update the quadtree only when needed
    this._createRenderGroupsCollisions();
    var bestRenderGroups = [];
    var x0 = renderBlock.nodePosition[0];
    var y0 = renderBlock.nodePosition[1];
    var x3 = renderBlock.nodePosition[0] + renderBlock.nodeSize[0];
    var y3 = renderBlock.nodePosition[1] + renderBlock.nodeSize[1];
    this._renderGroupsQuadtree.visit(function (d3QuadtreeNode) { // function (d3QuadtreeNode, x1, y1, x2, y2)
        var renderGroup = d3QuadtreeNode.point;
        if (renderGroup && renderGroup !== renderBlock) {
            var bounds = [renderGroup.nodePosition[0], renderGroup.nodePosition[1], renderGroup.nodePosition[0] + renderGroup.nodeSize[0], renderGroup.nodePosition[1] + renderGroup.nodeSize[1]];
            if (x0 > bounds[0] && y0 > bounds[1] && x3 < bounds[2] && y3 < bounds[3]) {
                bestRenderGroups.push(renderGroup);
            }
        }
        return false; // TODO: Optimize
    });
    var bestRenderGroup = null;
    _.forEach(bestRenderGroups, function (bestRenderGroupPossible) {
        if (renderBlock.renderGroupParent && bestRenderGroupPossible === renderBlock.renderGroupParent) {
            bestRenderGroup = bestRenderGroupPossible;
            return false;
        }
        if (bestRenderGroup === null) {
            bestRenderGroup = bestRenderGroupPossible;
        } else if (bestRenderGroupPossible.nodeSize[0] < bestRenderGroup.nodeSize[0] && bestRenderGroupPossible.nodeSize[1] < bestRenderGroup.nodeSize[1]) {
            bestRenderGroup = bestRenderGroupPossible;
        }
    });
    return bestRenderGroup;
};

/**
 * Returns the nearest renderer point at the given position
 * @param {Array<Number>} position
 * @return {dudeGraph.RenderPoint|null}
 */
dudeGraph.Renderer.prototype.nearestRenderPoint = function (position) {
    this._createRenderPointsCollisions(); // TODO: Update the quadtree only when needed
    var renderPoint = this._renderPointsQuadtree.find(position);
    if (renderPoint) {
        var renderPointPosition = renderPoint.pointAbsolutePosition;
        if (renderPointPosition[0] > position[0] - this._config.point.height && renderPointPosition[0] < position[0] + this._config.point.height &&
            renderPointPosition[1] > position[1] - this._config.point.height && renderPointPosition[1] < position[1] + this._config.point.height) {
            return renderPoint;
        }
    }
    return null;
};