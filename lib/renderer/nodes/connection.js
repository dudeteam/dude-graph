/**
 * Creates a rendererConnection
 * @param {Object} rendererConnectionData
 * @param {Boolean} [ignoreCgConnection=false] - Whether we ignore the creation of a cgConnection
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
        throw new cg.RendererError("Renderer::_createRendererConnection() Cannot create a rendererConnection without a cgConnection");
    }
    var rendererConnection = {
        "cgConnection": cgConnection,
        "outputRendererPoint": outputRendererPoint,
        "inputRendererPoint": inputRendererPoint
    };
    this._rendererConnections.push(rendererConnection);
};

/**
 * Removes the given rendererConnection
 * @param {cg.RendererConnection} rendererConnection
 * @private
 */
cg.Renderer.prototype._removeRendererConnection = function (rendererConnection) {
    var rendererConnectionFound = this._rendererConnections.indexOf(rendererConnection);
    if (rendererConnectionFound === -1) {
        throw new cg.RendererError("Renderer::_removeRendererConnection() Connection not found");
    }
    this._rendererConnections.splice(rendererConnectionFound, 1);
    rendererConnection.outputRendererPoint.cgPoint.disconnect(rendererConnection.inputRendererPoint.cgPoint);
};