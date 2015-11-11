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
                renderer.clearSelection();
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
                var attr = function (attrName) {
                    return parseInt(selectBrush.attr(attrName));
                };
                var position = renderer.screenToWorld([attr("x"), attr("y")]);
                var size = renderer.screenToWorld([attr("width") + attr("x"), attr("height") + attr("y")]);
                var renderNodes = renderer._getNearestRenderBlocks([position, size]);
                if (d3.event.sourceEvent.altKey) {
                    renderer._removeSelection(renderNodes);
                } else {
                    renderer._addSelection(renderNodes);
                }
                selectBrush.remove();
                selectBrush = null;
            }
        })
    );
};