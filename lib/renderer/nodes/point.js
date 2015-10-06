/**
 * Returns the rendererPoint associated with the given name
 * @param {dudeGraph.RendererBlock} rendererBlock
 * @param {String} rendererPointName
 * @returns {dudeGraph.RendererPoint|null}
 * @private
 */
dudeGraph.Renderer.prototype._getRendererPointByName = function (rendererBlock, rendererPointName) {
    return _.find(rendererBlock.rendererPoints, function (rendererPoint) {
            return rendererPoint.cgPoint.cgName === rendererPointName;
        }
    );
};

/**
 * Creates the rendererPoints for a given rendererBlock
 * @param {dudeGraph.RendererBlock} rendererBlock
 * @private
 */
dudeGraph.Renderer.prototype._createRendererPoints = function (rendererBlock) {
    rendererBlock.rendererPoints = [];
    _.forEach(rendererBlock.cgBlock.cgOutputs, function (cgOutput) {
        rendererBlock.rendererPoints.push({
            "type": "point",
            "rendererBlock": rendererBlock,
            "index": rendererBlock.cgBlock.cgOutputs.indexOf(cgOutput),
            "cgPoint": cgOutput,
            "isOutput": true
        });
    });
    _.forEach(rendererBlock.cgBlock.cgInputs, function (cgInput) {
        rendererBlock.rendererPoints.push({
            "type": "point",
            "rendererBlock": rendererBlock,
            "index": rendererBlock.cgBlock.cgInputs.indexOf(cgInput),
            "cgPoint": cgInput,
            "isOutput": false
        });
    });
};

/**
 * Returns all rendererConnections for the given rendererPoint
 * @param {dudeGraph.RendererPoint} rendererPoint
 * @returns {Array<dudeGraph.RendererConnection>}
 * @private
 */
dudeGraph.Renderer.prototype._getRendererPointRendererConnections = function (rendererPoint) {
    var rendererConnections = [];
    _.forEach(this._rendererConnections, function (rendererConnection) {
        if (rendererConnection.outputRendererPoint === rendererPoint || rendererConnection.inputRendererPoint === rendererPoint) {
            rendererConnections.push(rendererConnection);
        }
    });
    return rendererConnections;
};

/**
 * Removes all rendererConnections for the given rendererPoint
 * @param {dudeGraph.RendererPoint} rendererPoint
 * @private
 */
dudeGraph.Renderer.prototype._removeRendererPointRendererConnections = function (rendererPoint) {
    var renderer = this;
    var removeRendererConnections = renderer._getRendererPointRendererConnections(rendererPoint);
    _.forEach(removeRendererConnections, function (removeRendererConnection) {
        renderer._removeRendererConnection(removeRendererConnection);
    });
};