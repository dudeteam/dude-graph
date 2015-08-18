/**
 * Drags the d3Node around
 * @returns {d3.behavior.drag}
 * @private
 */
cg.Renderer.prototype._dragRendererNodeBehavior = function () {
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
            renderer.d3Nodes.classed("cg-active", false);
            var rendererGroup = renderer._getNearestRendererGroup(d3.select(this).datum());
            if (rendererGroup) {
                renderer._getD3NodesFromRendererNodes([rendererGroup]).classed("cg-active", true);
            }
        })
        .on("dragend", function () {
            renderer.d3Nodes.classed("cg-active", false);
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
 * Removes the rendererNode from his parent on double click
 * @returns {d3.behavior.doubleClick}
 * @private
 */
cg.Renderer.prototype._removeRendererNodeFromParentBehavior = function () {
    var renderer = this;
    return d3.behavior.doubleClick()
        .on("dblclick", function () {
            var d3Node = d3.select(this);
            var rendererNode = d3Node.datum();
            var rendererGroupParent = rendererNode.parent;
            if (rendererGroupParent) {
                d3.event.sourceEvent.preventDefault();
                d3.event.sourceEvent.stopPropagation();
                renderer._removeRendererNodeParent(rendererNode);
                // TODO: Optimize
                // renderer._updateSelectedD3Nodes(renderer._getD3NodesFromRendererNodes([rendererNode, rendererGroupParent]));
                renderer._updateSelectedD3Nodes(renderer.d3Nodes);
            }
        });
};

/**
 * Positions the rendererBlock at the mouse, and releases on mousedown
 * @param d3Block {d3.selection}
 * @private
 */
cg.Renderer.prototype._positionRendererBlockBehavior = function (d3Block) {
    var renderer = this;
    var namespace = ".placement-behavior";
    var disablePlacement = function () {
        renderer._d3Svg.on("mousemove" + namespace, null);
        renderer._d3Svg.on("mousedown" + namespace, null);
        renderer.d3Blocks.classed("cg-non-clickable", false);
        renderer.d3Groups.classed("cg-non-clickable", false);
    };
    disablePlacement();
    this.d3Blocks.classed("cg-non-clickable", true);
    this.d3Groups.classed("cg-non-clickable", true);
    this._d3Svg.on("mousemove" + namespace, function () {
        d3Block.datum().position = renderer._getRelativePosition(d3.mouse(this));
        renderer._updateSelectedD3Nodes(d3Block);
    });
    this._d3Svg.on("mousedown" + namespace, function () {
        d3.event.preventDefault();
        d3.event.stopPropagation();
        d3Block.datum().position = renderer._getRelativePosition(d3.mouse(this));
        renderer._updateSelectedD3Nodes(d3Block);
        disablePlacement();
    });
};

/**
 * Removes a connection when clicking and pressing alt on a d3Point
 * @returns {d3.behavior.click}
 * @private
 */
cg.Renderer.prototype._removeRendererConnectionBehavior = function () {
    var renderer = this;
    var rendererBlocks = [];
    return d3.behavior.mousedown()
        .on("mousedown", function (rendererPoint) {
            if (d3.event.sourceEvent.altKey) {
                d3.event.sourceEvent.preventDefault();
                d3.event.sourceEvent.stopImmediatePropagation();
                while (rendererPoint.connections.length > 0) {
                    var rendererConnection = rendererPoint.connections[0];
                    rendererBlocks.push(rendererConnection.outputPoint.rendererBlock, rendererConnection.inputPoint.rendererBlock);
                    renderer._removeRendererConnection(rendererConnection);
                }
                renderer._removeD3Connections();
                renderer._updateSelectedD3Blocks(renderer._getD3NodesFromRendererNodes(rendererBlocks));
            }
        });
};

/**
 * Drags a connection from a d3Point
 * @returns {d3.behavior.drag}
 * @private
 */
cg.Renderer.prototype._dragRendererConnectionBehavior = function () {
    var renderer = this;
    var computeConnectionPath = function (rendererPoint) {
        var rendererPointPosition = renderer._getRendererPointPosition(rendererPoint);
        if (rendererPoint.isOutput) {
            return renderer._computeConnectionPath(rendererPointPosition, renderer._getRelativePosition([d3.event.sourceEvent.clientX, d3.event.sourceEvent.clientY]));
        }
        return renderer._computeConnectionPath(renderer._getRelativePosition([d3.event.sourceEvent.clientX, d3.event.sourceEvent.clientY]), rendererPointPosition);
    };
    return d3.behavior.drag()
        .on("dragstart", function (rendererPoint) {
            d3.event.sourceEvent.preventDefault();
            d3.event.sourceEvent.stopPropagation();
            renderer.__draggingConnection = renderer._d3Connections
                .append("svg:path")
                .classed("cg-connection", true)
                .classed("cg-stream", function () {
                    return pandora.typename(rendererPoint.cgPoint) === "Stream";
                })
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
            renderer.__draggingConnection.remove();
            delete renderer.__draggingConnection;
        });
};