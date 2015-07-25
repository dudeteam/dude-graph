/**
 * Creates the drag and drop behavior
 * @returns {d3.behavior.drag}
 * @private
 */
cg.Renderer.prototype._createDragBehavior = function () {
    var renderer = this;
    return d3.behavior.drag()
        .on("dragstart", function () {
            var d3Node = d3.select(this);
            d3.event.sourceEvent.stopPropagation();
            renderer._addToSelection(d3Node, !d3.event.sourceEvent.shiftKey);
        })
        .on("drag", function () {
            renderer.selection.each(function (node) {
                node.position[0] += d3.event.dx;
                node.position[1] += d3.event.dy;
            });
            renderer.selection.attr("transform", function (node) {
                return "translate(" + node.position + ")";
            });
        });
};