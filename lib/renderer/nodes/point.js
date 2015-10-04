/**
 * Returns the rendererPoint associated with the given name
 * @param {cg.RendererBlock} rendererBlock
 * @param {String} rendererPointName
 * @returns {cg.RendererPoint|null}
 * @private
 */
cg.Renderer.prototype._getRendererPointByName = function (rendererBlock, rendererPointName) {
    return _.find(rendererBlock.rendererPoints, function (rendererPoint) {
            return rendererPoint.cgPoint.cgName === rendererPointName;
        }
    );
};

/**
 * Creates the rendererPoints for a given rendererBlock
 * @param {cg.RendererBlock} rendererBlock
 * @private
 */
cg.Renderer.prototype._createRendererPoints = function (rendererBlock) {
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
 * @param {cg.RendererPoint} rendererPoint
 * @returns {Array<cg.RendererConnection>}
 * @private
 */
cg.Renderer.prototype._getRendererPointRendererConnections = function (rendererPoint) {
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
 * @param {cg.RendererPoint} rendererPoint
 * @private
 */
cg.Renderer.prototype._removeRendererPointRendererConnections = function (rendererPoint) {
    var renderer = this;
    var removeRendererConnections = renderer._getRendererPointRendererConnections(rendererPoint);
    _.forEach(removeRendererConnections, function (removeRendererConnection) {
        renderer._removeRendererConnection(removeRendererConnection);
    });
};