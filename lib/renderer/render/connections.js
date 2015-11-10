/**
 * Creates d3Connections with the existing renderConnections
 * @private
 */
dudeGraph.Renderer.prototype._createD3Connections = function () {
    this.d3Connections
        .data(this._renderConnections, function (renderConnection) {
            return renderConnection.connectionId;
        })
        .enter()
        .append("svg:path")
        .attr("id", function (renderConnection) {
            return renderConnection.connectionId;
        })
        .classed("dude-graph-connection", true)
        .each(function (renderConnection) {
            renderConnection.create(d3.select(this));
        });
    this._updateD3Connections();
};

/**
 * Creates d3Connections with the existing renderConnections
 * @private
 */
dudeGraph.Renderer.prototype._updateD3Connections = function () {
    this.d3Connections.each(function (renderConnection) {
        renderConnection.update();
    });
};

/**
 * Removes d3Connections when renderConnections are removed
 * @private
 */
dudeGraph.Renderer.prototype._removeD3Connections = function () {
    this.d3Connections
        .data(this._renderConnections, function (renderConnection) {
            return renderConnection.connectionId;
        })
        .exit()
        .each(function (renderConnection) {
            renderConnection.remove();
        })
        .remove();
};