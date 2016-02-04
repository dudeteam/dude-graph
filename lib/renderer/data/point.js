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
 * @param {Boolean} [forceUpdate=false] - Whether to force update the renderer
 * @returns {dudeGraph.RenderPoint}
 */
dudeGraph.Renderer.prototype.createRenderPoint = function (renderPointData, forceUpdate) {
    var renderPoint = dudeGraph.RenderPoint.buildRenderPoint(this, renderPointData);
    renderPoint.renderBlock.addRenderPoint(renderPoint);
    if (forceUpdate) {
        renderPoint.renderBlock.updatePoints();
    }
};

/**
 * Removes the given renderPoint
 * @param {dudeGraph.RenderPoint} renderPoint
 * @param {Boolean} [forceUpdate=false] - Whether to force update the renderer
 */
dudeGraph.Renderer.prototype.removeRenderPoint = function (renderPoint, forceUpdate) {
    renderPoint.renderBlock.removeRenderPoint(renderPoint);
    if (forceUpdate) {
        renderPoint.renderBlock.updatePoints();
    }
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