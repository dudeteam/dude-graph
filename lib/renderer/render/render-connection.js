/**
 * Creates d3Connections with the existing rendererConnections
 * @private
 */
dudeGraph.Renderer.prototype._createD3Connections = function () {
    var createdD3Connections = this.d3Connections
        .data(this._rendererConnections, function (rendererConnection) {
            if (rendererConnection) {
                return rendererConnection.outputRendererPoint.rendererBlock.id + ":" + rendererConnection.outputRendererPoint.cgPoint.cgName + "," +
                    rendererConnection.inputRendererPoint.rendererBlock.id + ":" + rendererConnection.inputRendererPoint.cgPoint.cgName;
            }
        })
        .enter()
        .append("svg:path")
        .classed("dude-graph-connection", true)
        .classed("dude-graph-stream", function (rendererConnection) {
            return rendererConnection.inputRendererPoint.cgPoint.pointType === "Stream";
        });
    this._updateSelectedD3Connections(createdD3Connections);
};

/**
 * Updates all d3Connections
 * @private
 */
dudeGraph.Renderer.prototype._updatedD3Connections = function () {
    this._updateSelectedD3Connections(this.d3Connections);
};

/**
 * Updates selected d3Connections
 * @param {d3.selection} updatedD3Connections
 * @private
 */
dudeGraph.Renderer.prototype._updateSelectedD3Connections = function (updatedD3Connections) {
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
dudeGraph.Renderer.prototype._removeD3Connections = function () {
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