/**
 * Creates d3Connections with the existing cgConnections
 * @private
 */
cg.Renderer.prototype._createD3Connections = function () {
    var createdD3Connections = this._connectionsSvg.selectAll(".cg-connection")
        .data(this._cgGraph.cgConnections)
        .enter()
        .append("svg:path")
        .attr("class", "cg-connection")
        .classed("cg-stream", function (cgConnection) {
            return pandora.typename(cgConnection.cgInputPoint) === "Stream";
        });
    this._updateSelectedD3Connections(createdD3Connections);
};

/**
 * Updates all d3Connections
 * @private
 */
cg.Renderer.prototype._updatedD3Connections = function () {
    this._updateSelectedD3Connections(this._connectionsSvg.selectAll(".cg-connection"));
};

/**
 * Updates selected d3Connections
 * @param updatedD3Connections
 * @private
 */
cg.Renderer.prototype._updateSelectedD3Connections = function (updatedD3Connections) {
    updatedD3Connections
        .attr("d", function (cgConnection) {
            var p1 = this._getOutputPosition(cgConnection.cgOutputPoint);
            var p2 = this._getInputPosition(cgConnection.cgInputPoint);
            var step = Math.max(0.5 * (p1[0] - p2[1]) + 100, 50);
            return pandora.formatString("M{x},{y}C{x1},{y1} {x2},{y2} {x3},{y3}", {
                x: p1[0], y: p1[1],
                x1: p1[0] + step, y1: p1[1],
                x2: p2[0] - step, y2: p2[1],
                x3: p2[0], y3: p2[1]
            });
        }.bind(this))
};

/**
 *
 * @param cgPoint {cg.Point}
 * @returns {[Number, Number]}
 * @private
 */
cg.Renderer.prototype._getOutputPosition = function (cgPoint) {
    var rendererBlock = this._getRendererBlockById(cgPoint.cgBlock.cgId);
    var index = cgPoint.cgBlock.cgOutputs.indexOf(cgPoint.cgBlock.outputByName(cgPoint.cgName));
    return [
        rendererBlock.position[0] + rendererBlock.size[0] - this._config.block.padding,
        rendererBlock.position[1] + this._config.block.header + this._config.point.height * index
    ];
};

/**
 *
 * @param cgPoint {cg.Point}
 * @returns {[Number, Number]}
 * @private
 */
cg.Renderer.prototype._getInputPosition = function (cgPoint) {
    var rendererBlock = this._getRendererBlockById(cgPoint.cgBlock.cgId);
    var index = cgPoint.cgBlock.cgInputs.indexOf(cgPoint.cgBlock.inputByName(cgPoint.cgName));
    return [
        rendererBlock.position[0] + this._config.block.padding,
        rendererBlock.position[1] + this._config.block.header + this._config.point.height * index
    ];
};