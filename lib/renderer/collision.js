/**
 * Creates the collision quadtree
 * @private
 */
cg.Renderer.prototype._createRendererNodesCollisions = function () {
    this._rendererNodesQuadtree = d3.geom.quadtree()
        .x(function (rendererNode) {
            return rendererNode.position[0];
        })
        .y(function (rendererNode) {
            return rendererNode.position[1];
        })
    (this._rendererBlocks.concat(this._rendererGroups));
};

/**
 * Returns all renderer nodes in the given area
 * @param x0 {Number} Top left
 * @param y0 {Number} Top left
 * @param x3 {Number} Bottom right
 * @param y3 {Number} Bottom right
 * @return {Array<>}
 * @private
 */
cg.Renderer.prototype._getRendererNodesInArea = function (x0, y0, x3, y3) {
    // TODO: Update the quadtree only when needed
    this._createRendererNodesCollisions();
    var rendererNodes = [];
    this._rendererNodesQuadtree.visit(function (d3QuadtreeNode, x1, y1, x2, y2) {
        var rendererNode = d3QuadtreeNode.point;
        if (rendererNode) {
            var bounds = [rendererNode.position[0], rendererNode.position[1], rendererNode.position[0] + rendererNode.size[0], rendererNode.position[1] + rendererNode.size[1]];
            if ((bounds[0] >= x0) && (bounds[1] >= y0) && (bounds[2] < x3) && (bounds[3] < y3)) {
                rendererNodes.push(rendererNode);
            }
        }
        return x1 - 50 >= x3 || y1 - 35 >= y3 || x2 + 50 < x0 || y2 + 35 < y0;
    });
    return rendererNodes;
};