/**
 * Drags a connection from a d3Point
 * @returns {d3.behavior.drag}
 * @private
 */
dudeGraph.Renderer.prototype._dragRendererConnectionBehavior = function () {
    var renderer = this;
    var draggingConnection = null;
    var computeConnectionPath = function (rendererPoint) {
        var rendererPointPosition = renderer._getRendererPointPosition(rendererPoint, false);
        if (rendererPoint.isOutput) {
            return renderer._computeConnectionPath(rendererPointPosition, d3.mouse(this));
        }
        return renderer._computeConnectionPath(d3.mouse(this), rendererPointPosition);
    };
    return d3.behavior.drag()
        .on("dragstart", function (rendererPoint) {
            d3.event.sourceEvent.preventDefault();
            d3.event.sourceEvent.stopPropagation();
            draggingConnection = renderer._d3Connections
                .append("svg:path")
                .attr("class", function () {
                    return [
                        "dude-graph-connection",
                        rendererPoint.cgPoint.isOutput ?
                        "dude-graph-output-" + _.kebabCase(rendererPoint.cgPoint.cgValueType) :
                        "dude-graph-input-" + _.kebabCase(rendererPoint.cgPoint.cgValueType)
                    ].join(" ");
                })
                .attr("d", function () {
                    return computeConnectionPath.call(this, rendererPoint);
                });
        })
        .on("drag", function (rendererPoint) {
            draggingConnection
                .attr("d", function () {
                    return computeConnectionPath.call(this, rendererPoint);
                });
        })
        .on("dragend", function (rendererPoint) {
            var position = d3.mouse(renderer._d3Root.node());
            var nearestRendererPoint = renderer._getNearestRendererPoint(position);
            if (nearestRendererPoint && rendererPoint !== nearestRendererPoint) {
                try {
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
                } catch (connectionException) {
                    //console.error(connectionException);
                    renderer.emit("error", connectionException);
                }
            } else {
                renderer.emit("warning", "Renderer::_createD3PointShapes() No point found for creating connection");
                //console.warn("Renderer::_createD3PointShapes() No point found for creating connection");
            }
            draggingConnection.remove();
        });
};