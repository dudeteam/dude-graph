/**
 * Creates d3Connections with the existing renderConnections
 */
dudeGraph.Renderer.prototype.createD3Connections = function () {
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
    this.updateD3Connections();
};

/**
 * Updates d3Connections with the existing renderConnections
 */
dudeGraph.Renderer.prototype.updateD3Connections = function () {
    this.d3Connections.each(function (renderConnection) {
        renderConnection.update();
    });
};

/**
 * Removes d3Connections when renderConnections are removed
 */
dudeGraph.Renderer.prototype.removeD3Connections = function () {
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