/**
 * Creates d3Connections with the existing cgConnections
 * @private
 */
cg.Renderer.prototype._createD3Connections = function () {
    var createdD3Connections = this._d3Connections.selectAll(".cg-connection")
        .data(this._rendererConnections)
        .enter()
        .append("svg:path")
        .attr("class", "cg-connection")
        .classed("cg-stream", function (rendererConnection) {
            return pandora.typename(rendererConnection.inputPoint.cgPoint) === "Stream";
        });
    this._updateSelectedD3Connections(createdD3Connections);
};

/**
 * Updates all d3Connections
 * @private
 */
cg.Renderer.prototype._updatedD3Connections = function () {
    this._updateSelectedD3Connections(this._d3Connections.selectAll(".cg-connection"));
};

/**
 * Updates selected d3Connections
 * @param updatedD3Connections
 * @private
 */
cg.Renderer.prototype._updateSelectedD3Connections = function (updatedD3Connections) {
    updatedD3Connections
        .attr("d", function (rendererConnection) {
            var p1 = this._getRendererPointPosition(rendererConnection.outputPoint);
            var p2 = this._getRendererPointPosition(rendererConnection.inputPoint);
            var step = 150;
            if (p1[0] - p2[0] < 0) {
                step += Math.max(-100, p1[0] - p2[0]);
            }
            return pandora.formatString("M{x},{y}C{x1},{y1} {x2},{y2} {x3},{y3}", {
                x: p1[0], y: p1[1],
                x1: p1[0] + step, y1: p1[1],
                x2: p2[0] - step, y2: p2[1],
                x3: p2[0], y3: p2[1]
            });
        }.bind(this));
};