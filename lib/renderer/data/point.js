/**
 * Returns the renderPoint associated with the given name in the given renderBlock
 * @param {dudeGraph.RenderBlock} renderBlock
 * @param {String} renderPointName
 * @param {Boolean} isOutput
 * @returns {dudeGraph.RenderPoint|null}
 */
dudeGraph.Renderer.prototype.renderPointByName = function (renderBlock, renderPointName, isOutput) {
    return _.find(renderBlock.renderPoints, function (renderPoint) {
            return renderPoint.point.cgName === renderPointName && renderPoint.point.isOutput === isOutput;
        }) || null;
};

/**
 * Creates a renderPoint bound to a point
 * @param {Object} renderPointData
 * @returns {dudeGraph.RenderPoint}
 */
dudeGraph.Renderer.prototype.createRenderPoint = function (renderPointData) {
    return dudeGraph.RenderPoint.buildRenderPoint(this, renderPointData);
};

/**
 * Empties the given renderPoint by removing the value or connections
 * @param {dudeGraph.RenderPoint} renderPoint
 * @param {Boolean} [forceUpdate=false] - Whether to force update the renderer
 */
dudeGraph.Renderer.prototype.emptyRenderPoint = function (renderPoint, forceUpdate) {
    var renderer = this;
    var renderConnections = _.clone(renderPoint.renderConnections);
    _.forEach(renderConnections, function (renderConnection) {
        renderer.removeRenderConnection(renderConnection, forceUpdate);
    });
};