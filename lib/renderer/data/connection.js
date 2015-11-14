/**
 * Creates a renderConnection from data
 * @param {Object} rendererConnectionData
 */
dudeGraph.Renderer.prototype.createRenderConnection = function (rendererConnectionData) {
    var renderConnection = dudeGraph.RenderConnection.buildRenderConnection(this, rendererConnectionData);
    renderConnection.outputRenderPoint.renderConnections.push(renderConnection);
    renderConnection.inputRenderPoint.renderConnections.push(renderConnection);
    this._renderConnections.push(renderConnection);
    return renderConnection;
};

/**
 * Removes the given renderConnection
 * @param {dudeGraph.RenderConnection} renderConnection
 */
dudeGraph.Renderer.prototype.removeRenderConnection = function (renderConnection) {
    renderConnection.outputRenderPoint.point.disconnect(renderConnection.inputRenderPoint.point);
    _.pull(renderConnection.outputRenderPoint.renderConnections, renderConnection);
    _.pull(renderConnection.inputRenderPoint.renderConnections, renderConnection);
    _.pull(this._renderConnections, renderConnection);
};