/**
 * @param {Object} rendererConnectionData
 */
dudeGraph.Renderer.prototype.createRendererConnection = function (rendererConnectionData) {
    var renderConnection = dudeGraph.RenderConnection.buildRenderConnection(this, rendererConnectionData);
    renderConnection.outputRenderPoint.renderConnections.push(renderConnection);
    renderConnection.inputRenderPoint.renderConnections.push(renderConnection);
    this._renderConnections.push(renderConnection);
    return renderConnection;
};