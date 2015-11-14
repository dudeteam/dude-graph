/**
 * Creates a renderConnection from data
 * @param {Object} rendererConnectionData
 * @param {Boolean} [forceUpdate=false] - Whether to force update the renderer
 */
dudeGraph.Renderer.prototype.createRenderConnection = function (rendererConnectionData, forceUpdate) {
    var renderConnection = dudeGraph.RenderConnection.buildRenderConnection(this, rendererConnectionData);
    renderConnection.outputRenderPoint.renderConnections.push(renderConnection);
    renderConnection.inputRenderPoint.renderConnections.push(renderConnection);
    this._renderConnections.push(renderConnection);
    if (forceUpdate) {
        this.createD3Connections();
        renderConnection.outputRenderPoint.update();
        renderConnection.inputRenderPoint.update();
    }
    return renderConnection;
};

/**
 * Removes the given renderConnection and the underlying connection
 * @param {dudeGraph.RenderConnection} renderConnection
 * @param {Boolean} [forceUpdate=false] - Whether to force update the renderer
 */
dudeGraph.Renderer.prototype.removeRenderConnection = function (renderConnection, forceUpdate) {
    renderConnection.outputRenderPoint.point.disconnect(renderConnection.inputRenderPoint.point);
    _.pull(renderConnection.outputRenderPoint.renderConnections, renderConnection);
    _.pull(renderConnection.inputRenderPoint.renderConnections, renderConnection);
    _.pull(this._renderConnections, renderConnection);
    if (forceUpdate) {
        renderConnection.outputRenderPoint.update();
        renderConnection.inputRenderPoint.update();
        this.removeD3Connections();
    }
};