/**
 * Creates a renderConnection from data
 * @param {Object} rendererConnectionData
 * @param {Boolean} [forceUpdate=false] - Whether to force update the renderer
 */
dudeGraph.Renderer.prototype.createRenderConnection = function (rendererConnectionData, forceUpdate) {
    var renderConnection = dudeGraph.RenderConnection.buildRenderConnection(this, rendererConnectionData);
    renderConnection.outputRenderPoint.addRenderConnection(renderConnection);
    renderConnection.inputRenderPoint.addRenderConnection(renderConnection);
    this._renderConnections.push(renderConnection);
    if (forceUpdate) {
        this.createD3Connections();
        renderConnection.outputRenderPoint.update();
        renderConnection.inputRenderPoint.update();
    }
    this.emit("render-connection-add", this, renderConnection);
    return renderConnection;
};

/**
 * Removes the given renderConnection and the underlying connection
 * @param {dudeGraph.RenderConnection} renderConnection
 * @param {Boolean} [forceUpdate=false] - Whether to force update the renderer
 */
dudeGraph.Renderer.prototype.removeRenderConnection = function (renderConnection, forceUpdate) {
    renderConnection.outputRenderPoint.point.disconnect(renderConnection.inputRenderPoint.point);
    renderConnection.outputRenderPoint.removeRenderConnection(renderConnection);
    renderConnection.inputRenderPoint.removeRenderConnection(renderConnection);
    _.pull(this._renderConnections, renderConnection);
    if (forceUpdate) {
        renderConnection.outputRenderPoint.update();
        renderConnection.inputRenderPoint.update();
        this.removeD3Connections();
    }
    this.emit("render-connection-remove", this, renderConnection);
};