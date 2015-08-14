/**
 * Creates a rendererConnection
 * @param rendererConnectionData {Object}
 * @private
 */
cg.Renderer.prototype._createRendererConnection = function (rendererConnectionData) {
    var outputRendererPoint = rendererConnectionData.outputRendererPoint || this._getRendererPointByName(this._getRendererBlockById(rendererConnectionData.outputBlockId), rendererConnectionData.outputName);
    var inputRendererPoint = rendererConnectionData.inputRendererPoint || this._getRendererPointByName(this._getRendererBlockById(rendererConnectionData.inputBlockId), rendererConnectionData.inputName);
    if (!outputRendererPoint) {
        throw new cg.RendererError("Renderer::_createRendererConnection() Cannot find the outputRendererPoint");
    }
    if (!inputRendererPoint) {
        throw new cg.RendererError("Renderer::_createRendererConnection() Cannot find the inputRendererPoint");
    }
    if (!this._cgGraph.connectionByPoints(outputRendererPoint.cgPoint, inputRendererPoint.cgPoint)) {
        outputRendererPoint.cgPoint.connect(inputRendererPoint.cgPoint);
    }
    var rendererConnection = {
        "outputPoint": outputRendererPoint,
        "inputPoint": inputRendererPoint
    };
    this._rendererConnections.push(rendererConnection);
    outputRendererPoint.connections.push(rendererConnection);
    inputRendererPoint.connections.push(rendererConnection);
};

/**
 * Removes the given rendererConnection
 * @param rendererConnection {cg.RendererConnection}
 * @private
 */
cg.Renderer.prototype._removeRendererConnection = function (rendererConnection) {
    var outputPointRendererConnectionFound = rendererConnection.outputPoint.connections.indexOf(rendererConnection);
    var inputPointRendererConnectionFound = rendererConnection.inputPoint.connections.indexOf(rendererConnection);
    var rendererConnectionFound = this._rendererConnections.indexOf(rendererConnection);
    if (outputPointRendererConnectionFound === -1 || inputPointRendererConnectionFound === -1) {
        throw new cg.RendererError("Renderer::_removeRendererConnection() Cannot find connection in inputPoint or outputPoint");
    }
    if (rendererConnectionFound === -1) {
        throw new cg.RendererError("Renderer::_removeRendererConnection() Connection not found");
    }
    rendererConnection.outputPoint.connections.splice(outputPointRendererConnectionFound, 1);
    rendererConnection.inputPoint.connections.splice(inputPointRendererConnectionFound, 1);
    this._rendererConnections.splice(rendererConnectionFound, 1);
};