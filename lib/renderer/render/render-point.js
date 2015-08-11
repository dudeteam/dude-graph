/**
 * Creates d3Points
 * @param d3Block {d3.selection} The svg group which will contains the d3Points of the current block
 * @private
 */
cg.Renderer.prototype._createD3Points = function (d3Block) {
    var renderer = this;
    var createdD3Points = d3Block
        .selectAll(".cg-output, .cg-input")
        .data(function (rendererBlock) {
            return rendererBlock.rendererPoints;
        }, function (rendererPoint) {
            return rendererPoint.cgPoint.cgName;
        })
        .enter()
        .append("svg:g")
        .attr("class", function (rendererPoint) {
            return "cg-" + (rendererPoint.isOutput ? "output" : "input");
        })
        .each(function () {
            renderer._createD3PointShapes(d3.select(this));
        });
    createdD3Points
        .append("svg:text")
        .attr("alignment-baseline", "middle")
        .attr("text-anchor", function (rendererPoint) {
            return rendererPoint.isOutput ? "end" : "start";
        })
        .text(function (rendererPoint) {
            return rendererPoint.cgPoint.cgName;
        });
    this._updateSelected3DPoints(createdD3Points);
};

/**
 * Updates the selected d3Points
 * @param updatedD3Points
 * @private
 */
cg.Renderer.prototype._updateSelected3DPoints = function (updatedD3Points) {
    var renderer = this;
    updatedD3Points
        .classed("cg-empty", function (rendererPoint) {
            return rendererPoint.connections.length === 0;
        })
        .classed("cg-stream", function (rendererPoint) {
            return pandora.typename(rendererPoint.cgPoint) === "Stream";
        })
        .attr("transform", function (rendererPoint) {
            if (rendererPoint.isOutput) {
                return "translate(" + [
                        rendererPoint.rendererBlock.size[0] - renderer._config.block.padding,
                        rendererPoint.index * renderer._config.point.height + renderer._config.block.header
                    ] + ")";
            } else {
                return "translate(" + [
                        renderer._config.block.padding,
                        rendererPoint.index * renderer._config.point.height + renderer._config.block.header
                    ] + ")";
            }
        });
    updatedD3Points
        .select("text")
        .attr("transform", function (rendererPoint) {
            if (rendererPoint.isOutput) {
                return "translate(" + [-renderer._config.point.radius * 2 - renderer._config.block.padding] + ")";
            } else {
                return "translate(" + [renderer._config.point.radius * 2 + renderer._config.block.padding] + ")";
            }
        });
};

/**
 * Creates the d3PointShapes
 * @param d3Point {d3.selection}
 * @returns {d3.selection}
 * @private
 */
cg.Renderer.prototype._createD3PointShapes = function (d3Point) {
    var renderer = this;
    var computeConnectionPath = function (rendererPoint) {
        var rendererPointPosition = renderer._getRendererPointPosition(rendererPoint);
        if (rendererPoint.isOutput) {
            return renderer._computeConnectionPath(rendererPointPosition, renderer._getRelativePosition([d3.event.sourceEvent.clientX, d3.event.sourceEvent.clientY]));
        }
        return renderer._computeConnectionPath(renderer._getRelativePosition([d3.event.sourceEvent.clientX, d3.event.sourceEvent.clientY]), rendererPointPosition);
    };
    d3Point
        .selectAll(".cg-point-shape")
        .data(d3Point.data(), function (rendererPoint) {
            return rendererPoint.cgPoint.cgName;
        })
        .enter()
        .append("svg:path")
        .classed("cg-point-shape", true)
        .attr("d", function (rendererPoint) {
            var r = renderer._config.point.radius;
            if (pandora.typename(rendererPoint.cgPoint) === "Stream") {
                return ["M " + -r + " " + -r * 2 + " L " + -r + " " + r * 2 + " L " + r + " " + 0 + " Z"];
            } else {
                return ["M 0, 0", "m " + -r + ", 0", "a " + [r, r] + " 0 1,0 " + r * 2 + ",0", "a " + [r, r] + " 0 1,0 " + -(r * 2) + ",0"];
            }
        })
        .call(d3.behavior.drag()
            .on("dragstart", function (rendererPoint) {
                d3.event.sourceEvent.preventDefault();
                d3.event.sourceEvent.stopPropagation();
                renderer.__draggingConnection = renderer._d3Connections
                    .append("svg:path")
                    .classed("cg-connection", true)
                    .attr("d", function () {
                        return computeConnectionPath(rendererPoint);
                    });
            })
            .on("drag", function (rendererPoint) {
                renderer.__draggingConnection
                    .attr("d", function () {
                        return computeConnectionPath(rendererPoint);
                    });
            })
            .on("dragend", function (rendererPoint) {
                var position = renderer._getRelativePosition([d3.event.sourceEvent.clientX, d3.event.sourceEvent.clientY]);
                var nearestRendererPoint = renderer._getNearestRendererPoint(position);
                if (nearestRendererPoint) {
                    if (rendererPoint.isOutput) {
                        renderer._createRendererConnection({
                            "outputRendererPoint": rendererPoint,
                            "inputRendererPoint": nearestRendererPoint
                        });
                    } else {
                        renderer._createRendererConnection({
                            "outputRendererPoint": nearestRendererPoint,
                            "inputRendererPoint": rendererPoint
                        });
                    }
                    renderer._createD3Connections();
                    // TODO: Optimize
                    renderer._updateD3Blocks();
                } else {
                    console.warn("Renderer::_createD3PointShapes() No point found for creating connection");
                }
                renderer.__draggingConnection.remove();
                delete renderer.__draggingConnection;
            })
    );
};