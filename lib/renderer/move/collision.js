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
 * Returns all RendererNodes overlapping the given area
 * @param {Number} x0 - Top left x
 * @param {Number} y0 - Top left y
 * @param {Number} x3 - Bottom right x
 * @param {Number} y3 - Bottom right y
 * @return {Array<dudeGraph.RenderBlock>}
 * @private
 */
dudeGraph.Renderer.prototype._getNearestRenderBlocks = function (x0, y0, x3, y3) {
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
            if (!(x0 > bounds[2] || y0 > bounds[3] || x3 < bounds[0] || y3 < bounds[1])) {
                renderBlocks.push(renderBlock);
            }
        }
        return x1 - 50 >= x3 || y1 - 35 >= y3 || x2 + 50 < x0 || y2 + 35 < y0;
    });
    return renderBlocks;
};