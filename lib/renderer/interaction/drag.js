/**
 * Drags the d3Node around
 * @returns {d3.behavior.drag}
 * @private
 */
dudeGraph.Renderer.prototype._dragRendererNodeBehavior = function () {
    var renderer = this;
    return d3.behavior.drag()
        .on("dragstart", function () {
            d3.event.sourceEvent.preventDefault();
            d3.event.sourceEvent.stopPropagation();
            renderer._addToSelection(d3.select(this), !d3.event.sourceEvent.shiftKey);
            renderer._d3MoveToFront(renderer.d3GroupedSelection);
        })
        .on("drag", function () {
            var selection = renderer.d3GroupedSelection;
            selection.each(function (rendererNode) {
                rendererNode.position[0] += d3.event.dx;
                rendererNode.position[1] += d3.event.dy;
            });
            renderer._updateSelectedD3Nodes(selection);
            renderer.d3Nodes.classed("dude-graph-active", false);
            var rendererGroup = renderer._getNearestRendererGroup(d3.select(this).datum());
            if (rendererGroup) {
                renderer._getD3NodesFromRendererNodes([rendererGroup]).classed("dude-graph-active", true);
            }
        })
        .on("dragend", function () {
            renderer.d3Nodes.classed("dude-graph-active", false);
            var selection = renderer.d3Selection;
            var rendererGroup = renderer._getNearestRendererGroup(d3.select(this).datum());
            if (rendererGroup) {
                selection.each(function (rendererNode) {
                    renderer._addRendererNodeParent(rendererNode, rendererGroup);
                });
            }
            renderer._updateSelectedD3Nodes(selection);
        });
};

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

/**
 * Positions the rendererBlock at the mouse, and releases on mousedown
 * @param {d3.selection} d3Block
 * @private
 */
dudeGraph.Renderer.prototype._rendererBlockDragPositionBehavior = function (d3Block) {
    var renderer = this;
    var namespace = ".placement-behavior";
    var disablePlacement = function () {
        renderer._d3Svg.on("mousemove" + namespace, null);
        renderer._d3Svg.on("mousedown" + namespace, null);
        renderer.d3Blocks.classed("dude-graph-non-clickable", false);
        renderer.d3Groups.classed("dude-graph-non-clickable", false);
    };
    disablePlacement();
    this.d3Blocks.classed("dude-graph-non-clickable", true);
    this.d3Groups.classed("dude-graph-non-clickable", true);
    this._d3Svg.on("mousemove" + namespace, function () {
        d3Block.datum().position = d3.mouse(renderer._d3Root.node());
        renderer._updateSelectedD3Nodes(d3Block);
    });
    this._d3Svg.on("mousedown" + namespace, function () {
        d3.event.preventDefault();
        d3.event.stopPropagation();
        d3Block.datum().position = d3.mouse(renderer._d3Root.node());
        renderer._updateSelectedD3Nodes(d3Block);
        disablePlacement();
    });
};