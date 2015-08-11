/**
 * Creates a renderer connection
 * @param data
 * @private
 */
cg.Renderer.prototype._createRendererConnection = function (data) {
    var outputRendererPoint = data.outputRendererPoint || this._getRendererPointByName(this._getRendererBlockById(data.outputBlockId), data.outputName);
    var inputRendererPoint = data.inputRendererPoint || this._getRendererPointByName(this._getRendererBlockById(data.inputBlockId), data.inputName);
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