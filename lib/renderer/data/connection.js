/**
 * Returns the renderBlocks associated with the given block
 * @param {dudeGraph.Connection} connection
 * @return {dudeGraph.RenderConnection|null}
 */
dudeGraph.Renderer.prototype.renderConnectionByConnection = function (connection) {
    return _.find(this._renderConnections, function (renderConnection) {
        return renderConnection.connection === connection;
    }) || null;
};

/**
 * Creates a renderConnection from data
 * @param {Object} rendererConnectionData
 * @param {Boolean} [forceUpdate=false] - Whether to force update the renderer
 * @return {dudeGraph.Connection}
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
    if (renderConnection.outputRenderPoint.point.connectedTo(renderConnection.inputRenderPoint.point)) {
        renderConnection.outputRenderPoint.point.disconnect(renderConnection.inputRenderPoint.point);
    }
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