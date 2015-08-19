/**
 * Creates a rendererConnection
 * @param rendererConnectionData {Object}
 * @param ignoreCgConnection {Boolean?} Whether we ignore the creation of a cgConnection
 * @private
 */
cg.Renderer.prototype._createRendererConnection = function (rendererConnectionData, ignoreCgConnection) {
    var outputRendererPoint = rendererConnectionData.outputRendererPoint || this._getRendererPointByName(this._getRendererBlockById(rendererConnectionData.outputBlockId), rendererConnectionData.outputName);
    var inputRendererPoint = rendererConnectionData.inputRendererPoint || this._getRendererPointByName(this._getRendererBlockById(rendererConnectionData.inputBlockId), rendererConnectionData.inputName);
    var cgConnection = rendererConnectionData.cgConnection;
    if (!outputRendererPoint) {
        throw new cg.RendererError("Renderer::_createRendererConnection() Cannot find the outputRendererPoint");
    }
    if (!inputRendererPoint) {
        throw new cg.RendererError("Renderer::_createRendererConnection() Cannot find the inputRendererPoint");
    }
    if (!ignoreCgConnection) {
        cgConnection = outputRendererPoint.cgPoint.connect(inputRendererPoint.cgPoint);
    } else {
        pandora.forEach(this._rendererConnections, function (rendererConnection) {
            if (rendererConnection.cgConnection === cgConnection) {
                throw new cg.RendererError("Renderer::_createRendererConnection() Connections `{0}` is already handled in the renderer by the rendererConnection `{1}`", cgConnection, rendererConnection);
            }
        });
    }
    if (!cgConnection) {
        throw new cg.RendererError("Renderer::_createRendererConnection() Cannot create a rendererConnection without an existing cgConnection");
    }
    var rendererConnection = {
        "cgConnection": cgConnection,
        "outputRendererPoint": outputRendererPoint,
        "inputRendererPoint": inputRendererPoint
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
    var outputRendererPointRendererConnectionFound = rendererConnection.outputRendererPoint.connections.indexOf(rendererConnection);
    var inputRendererPointRendererConnectionFound = rendererConnection.inputRendererPoint.connections.indexOf(rendererConnection);
    var rendererConnectionFound = this._rendererConnections.indexOf(rendererConnection);
    if (outputRendererPointRendererConnectionFound === -1) {
        throw new cg.RendererError("Renderer::_removeRendererConnection() Cannot find connection in outputRendererPoint");
    }
    if (inputRendererPointRendererConnectionFound === -1) {
        throw new cg.RendererError("Renderer::_removeRendererConnection() Cannot find connection in inputRendererPoint");
    }
    if (rendererConnectionFound === -1) {
        throw new cg.RendererError("Renderer::_removeRendererConnection() Connection not found");
    }
    rendererConnection.outputRendererPoint.connections.splice(outputRendererPointRendererConnectionFound, 1);
    rendererConnection.inputRendererPoint.connections.splice(inputRendererPointRendererConnectionFound, 1);
    this._rendererConnections.splice(rendererConnectionFound, 1);
    // TODO: Remove connection from cgGraph
};