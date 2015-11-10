/**
 * Returns the renderPoint associated with the given name in the given renderBlock
 * @param {dudeGraph.RenderBlock} renderBlock
 * @param {String} renderPointName
 * @returns {dudeGraph.RenderPoint|null}
 */
dudeGraph.Renderer.prototype.getRenderPointByName = function (renderBlock, renderPointName) {
    return _.find(renderBlock.renderPoints, function (rendererPoint) {
            return rendererPoint.point.cgName === renderPointName;
        }
    );
};