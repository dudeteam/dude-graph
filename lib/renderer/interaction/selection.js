/**
 * Creates the selection brush
 * @private
 */
cg.Renderer.prototype._createSelectionBehavior = function () {
    var renderer = this;
    var selectionBrush = null;
    this._d3Svg.call(d3.behavior.drag()
            .on("dragstart", function () {
                if (d3.event.sourceEvent.shiftKey) {
                    d3.event.sourceEvent.stopImmediatePropagation();
                    selectionBrush = renderer._d3Svg
                        .append("svg:rect")
                        .classed("cg-selection", true)
                        .datum(d3.mouse(this));
                } else {
                    renderer._clearSelection();
                }
            })
            .on("drag", function () {
                if (selectionBrush) {
                    var position = d3.mouse(this);
                    selectionBrush.attr({
                        "x": function (origin) {
                            return Math.min(origin[0], position[0]);
                        },
                        "y": function (origin) {
                            return Math.min(origin[1], position[1]);
                        },
                        "width": function (origin) {
                            return Math.max(position[0] - origin[0], origin[0] - position[0]);
                        },
                        "height": function (origin) {
                            return Math.max(position[1] - origin[1], origin[1] - position[1]);
                        }
                    });
                }
            })
            .on("dragend", function () {
                if (selectionBrush) {
                    var selectionBrushTopLeft = renderer._getRelativePosition([parseInt(selectionBrush.attr("x")), parseInt(selectionBrush.attr("y"))]);
                    var selectionBrushBottomRight = renderer._getRelativePosition([parseInt(selectionBrush.attr("x")) + parseInt(selectionBrush.attr("width")), parseInt(selectionBrush.attr("y")) + parseInt(selectionBrush.attr("height"))]);
                    var selectedRendererNodes = renderer._getNearestRendererBlocks(selectionBrushTopLeft[0], selectionBrushTopLeft[1], selectionBrushBottomRight[0], selectionBrushBottomRight[1]);
                    if (selectedRendererNodes.length > 0) {
                        renderer._addToSelection(renderer._getD3NodesFromRendererNodes(selectedRendererNodes), true);
                    } else {
                        renderer._clearSelection();
                    }
                    selectionBrush.remove();
                    selectionBrush = null;
                }
            })
    );
};

/**
 * Adds the given d3Nodes to the current selection
 * @param d3Nodes {d3.selection} The d3Nodes to select
 * @param clearSelection {Boolean?} If true, everything but the d3Nodes will be unselected
 * @private
 */
cg.Renderer.prototype._addToSelection = function (d3Nodes, clearSelection) {
    if (clearSelection) {
        this._clearSelection(true);
    }
    d3Nodes.classed("cg-selected", true);
    this.emit("cg-select", d3Nodes.data()[d3Nodes.data().length - 1]);
};

/**
 * Clears the selection
 * @param ignoreEmit {Boolean?} If true, the unselect event will not be emitted
 * @private
 */
cg.Renderer.prototype._clearSelection = function (ignoreEmit) {
    this.d3Selection.classed("cg-selected", false);
    if (!ignoreEmit) {
        this.emit("cg-unselect");
    }
};