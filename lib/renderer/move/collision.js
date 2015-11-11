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
 * @param {[[Number, Number], [Number, Number]]} rect
 * @return {Array<dudeGraph.RenderBlock>}
 * @private
 */
dudeGraph.Renderer.prototype._getNearestRenderBlocks = function (rect) {
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