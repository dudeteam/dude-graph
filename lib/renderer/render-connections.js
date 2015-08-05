/**
 * Creates d3Connections with the existing cgConnections
 * @private
 */
cg.Renderer.prototype._createD3Connections = function () {
    this._connectionsSvg.selectAll(".cg-connection")
        .data(this._cgGraph.cgConnections)
        .enter()
        .append("svg:path")
            .attr("class", "cg-connection")
            .classed("cg-stream", function (cgConnection) {
                return pandora.typename(cgConnection.cgInputPoint) === "Stream";
            })
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

cg.Renderer.prototype._getOutputPosition = function (point) {
    var rendererBlock = this._getRendererBlockById(point.cgBlock.cgId);
    var index = point.cgBlock.cgOutputs.indexOf(point.cgBlock.outputByName(point.cgName));
    return [
        rendererBlock.position[0] + rendererBlock.size[0] - this._config.block.padding,
        rendererBlock.position[1] + this._config.block.header + this._config.point.height * index
    ];
};

cg.Renderer.prototype._getInputPosition = function (point) {
    var rendererBlock = this._getRendererBlockById(point.cgBlock.cgId);
    var index = point.cgBlock.cgInputs.indexOf(point.cgBlock.inputByName(point.cgName));
    return [
        rendererBlock.position[0] + this._config.block.padding,
        rendererBlock.position[1] + this._config.block.header + this._config.point.height * index
    ];
};