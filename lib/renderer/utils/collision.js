/**
 * Creates the collision quadtree
 * @private
 */
cg.Renderer.prototype._createRendererBlocksCollisions = function () {
    this._rendererBlocksQuadtree = d3.geom.quadtree()
        .x(function (rendererBlock) {
            return rendererBlock.position[0];
        })
        .y(function (rendererBlock) {
            return rendererBlock.position[1];
        })(this._rendererBlocks);
};

/**
 * Creates the collision quadtree
 * @private
 */
cg.Renderer.prototype._createRendererGroupsCollisions = function () {
    this._rendererGroupsQuadtree = d3.geom.quadtree()
        .x(function (rendererGroup) {
            return rendererGroup.position[0];
        })
        .y(function (rendererGroup) {
            return rendererGroup.position[1];
        })(this._rendererGroups);
};

/**
 * Creates the collision quadtree
 * @private
 */
cg.Renderer.prototype._createRendererPointsCollisions = function () {
    var renderer = this;
    var rendererPoints = [];
    pandora.forEach(this._rendererBlocks, function (rendererBlock) {
        rendererPoints = rendererPoints.concat(rendererBlock.rendererPoints);
    });
    this._rendererPointsQuadtree = d3.geom.quadtree()
        .x(function (rendererPoint) {
            return renderer._getRendererPointPosition(rendererPoint)[0];
        })
        .y(function (rendererPoint) {
            return renderer._getRendererPointPosition(rendererPoint)[1];
        })(rendererPoints);
};

/**
 * Returns all RendererNodes overlapping the given area
 * @param x0 {Number} Top left x
 * @param y0 {Number} Top left y
 * @param x3 {Number} Bottom right x
 * @param y3 {Number} Bottom right y
 * @return {Array<cg.RendererNode>}
 * @private
 */
cg.Renderer.prototype._getNearestRendererBlocks = function (x0, y0, x3, y3) {
    // TODO: Update the quadtree only when needed
    this._createRendererBlocksCollisions();
    var rendererBlocks = [];
    this._rendererBlocksQuadtree.visit(function (d3QuadtreeNode, x1, y1, x2, y2) {
        var rendererBlock = d3QuadtreeNode.point;
        if (rendererBlock) {
            var bounds = [rendererBlock.position[0], rendererBlock.position[1], rendererBlock.position[0] + rendererBlock.size[0], rendererBlock.position[1] + rendererBlock.size[1]];
            if (!(x0 > bounds[2] || y0 > bounds[3] || x3 < bounds[0] || y3 < bounds[1])) {
                rendererBlocks.push(rendererBlock);
            }
        }
        return x1 - 50 >= x3 || y1 - 35 >= y3 || x2 + 50 < x0 || y2 + 35 < y0;
    });
    return rendererBlocks;
};

/**
 * Get the best rendererGroup that can accept the given rendererNode
 * @param rendererNode {cg.RendererNode}
 * @returns {cg.RendererGroup|null}
 * @private
 */
cg.Renderer.prototype._getNearestRendererGroup = function (rendererNode) {
    // TODO: Update the quadtree only when needed
    this._createRendererGroupsCollisions();
    var bestRendererGroups = [];
    var x0 = rendererNode.position[0];
    var y0 = rendererNode.position[1];
    var x3 = rendererNode.position[0] + rendererNode.size[0];
    var y3 = rendererNode.position[1] + rendererNode.size[1];
    this._rendererGroupsQuadtree.visit(function (d3QuadtreeNode, x1, y1, x2, y2) {
        var rendererGroup = d3QuadtreeNode.point;
        if (rendererGroup && rendererGroup !== rendererNode) {
            var bounds = [rendererGroup.position[0], rendererGroup.position[1], rendererGroup.position[0] + rendererGroup.size[0], rendererGroup.position[1] + rendererGroup.size[1]];
            if (x0 > bounds[0] && y0 > bounds[1] && x3 < bounds[2] && y3 < bounds[3]) {
                bestRendererGroups.push(rendererGroup);
            }
        }
        return false; // TODO: Optimize
    });
    var bestRendererGroup = null;
    pandora.forEach(bestRendererGroups, function (bestRendererGroupPossible) {
        if (bestRendererGroupPossible === rendererNode.parent) {
            bestRendererGroup = bestRendererGroupPossible;
            return true;
        }
        if (bestRendererGroup === null) {
            bestRendererGroup = bestRendererGroupPossible;
        } else if (bestRendererGroupPossible.size[0] < bestRendererGroup.size[0] && bestRendererGroupPossible.size[1] < bestRendererGroup.size[1]) {
            bestRendererGroup = bestRendererGroupPossible;
        }
    });
    return bestRendererGroup;
};

/**
 * Returns
 * @param position {[Number, Number]}
 * @return {cg.Point|null}
 * @private
 */
cg.Renderer.prototype._getNearestRendererPoint = function (position) {
    // TODO: Update the quadtree only when needed
    this._createRendererPointsCollisions();
    var rendererPoint = this._rendererPointsQuadtree.find(position);
    if (rendererPoint) {
        var rendererPointPosition = this._getRendererPointPosition(rendererPoint);
        if (rendererPointPosition[0] > position[0] - this._config.point.height && rendererPointPosition[0] < position[0] + this._config.point.height &&
            rendererPointPosition[1] > position[1] - this._config.point.height && rendererPointPosition[1] < position[1] + this._config.point.height) {
            return rendererPoint;
        }
    }
    return null;
};