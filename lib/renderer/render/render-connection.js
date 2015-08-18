/**
 * Creates d3Connections with the existing rendererConnections
 * @private
 */
cg.Renderer.prototype._createD3Connections = function () {
    var createdD3Connections = this.d3Connections
        .data(this._rendererConnections, function (rendererConnection) {
            if (rendererConnection) {
                return rendererConnection.outputRendererPoint.rendererBlock.id + ":" + rendererConnection.outputRendererPoint.cgPoint.cgName + "," +
                    rendererConnection.inputRendererPoint.rendererBlock.id + ":" + rendererConnection.inputRendererPoint.cgPoint.cgName;
            }
        })
        .enter()
        .append("svg:path")
        .classed("cg-connection", true)
        .classed("cg-stream", function (rendererConnection) {
            return pandora.typename(rendererConnection.inputRendererPoint.cgPoint) === "Stream";
        });
    this._updateSelectedD3Connections(createdD3Connections);
};

/**
 * Updates all d3Connections
 * @private
 */
cg.Renderer.prototype._updatedD3Connections = function () {
    this._updateSelectedD3Connections(this.d3Connections);
};

/**
 * Updates selected d3Connections
 * @param updatedD3Connections
 * @private
 */
cg.Renderer.prototype._updateSelectedD3Connections = function (updatedD3Connections) {
    var renderer = this;
    updatedD3Connections
        .attr("d", function (rendererConnection) {
            var rendererPointPosition1 = this._getRendererPointPosition(rendererConnection.outputRendererPoint);
            var rendererPointPosition2 = this._getRendererPointPosition(rendererConnection.inputRendererPoint);
            return renderer._computeConnectionPath(rendererPointPosition1, rendererPointPosition2);
        }.bind(this));
};

/**
 * Removes d3Connections when rendererConnections are removed
 * @private
 */
cg.Renderer.prototype._removeD3Connections = function () {
    var removedRendererConnections = this.d3Connections
        .data(this._rendererConnections, function (rendererConnection) {
            if (rendererConnection) {
                return rendererConnection.outputRendererPoint.rendererBlock.id + ":" + rendererConnection.outputRendererPoint.cgPoint.cgName + "," +
                    rendererConnection.inputRendererPoint.rendererBlock.id + ":" + rendererConnection.inputRendererPoint.cgPoint.cgName;
            }
        })
        .exit()
        .remove();
};