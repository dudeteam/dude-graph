/**
 * Creates the select brush
 * @private
 */
dudeGraph.Renderer.prototype._createSelectionBehavior = function () {
    var renderer = this;
    var selectBrush = null;
    this._d3Svg.call(d3.behavior.drag()
        .on("dragstart", function () {
            if (d3.event.sourceEvent.shiftKey) {
                d3.event.sourceEvent.stopImmediatePropagation();
                selectBrush = renderer._d3Svg
                    .append("svg:rect")
                    .classed("dude-graph-select", true)
                    .datum(d3.mouse(this));
            } else {
                renderer._clearSelection();
            }
        })
        .on("drag", function () {
            if (selectBrush) {
                var position = d3.mouse(this);
                selectBrush.attr({
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
            if (selectBrush !== null) {
                var selectTopLeft = [parseInt(selectBrush.attr("x")), parseInt(selectBrush.attr("y"))];
                var selectBottomRight = [
                    selectTopLeft[0] + parseInt(selectBrush.attr("width")),
                    selectTopLeft[1] + parseInt(selectBrush.attr("height"))
                ];
                var selectTopLeftWorld = renderer._screenToWorld(selectTopLeft);
                var selectBottomRightWorld = renderer._screenToWorld(selectBottomRight);
                var selectedRenderBlocks = renderer._getNearestRenderBlocks(
                    selectTopLeftWorld[0], selectTopLeftWorld[1],
                    selectBottomRightWorld[0], selectBottomRightWorld[1]
                );
                if (d3.event.sourceEvent.altKey) {
                    renderer._removeSelection(selectedRenderBlocks);
                } else {
                    renderer._addSelection(selectedRenderBlocks);
                }
                selectBrush.remove();
                selectBrush = null;
            }
        })
    );
};