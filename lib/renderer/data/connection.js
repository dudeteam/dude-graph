/**
 * @param {Object} rendererConnectionData
 */
dudeGraph.Renderer.prototype.createRendererConnection = function (rendererConnectionData) {
    var renderConnection = dudeGraph.RenderConnection.buildRenderConnection(this, rendererConnectionData);
    this._renderConnections.push(renderConnection);
    return renderConnection;
};