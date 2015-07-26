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
            var selection = renderer.groupedSelection;
            selection.each(function(rendererNode) {
                rendererNode.position[0] += d3.event.dx;
                rendererNode.position[1] += d3.event.dy;
            });
            selection.attr("transform", function (rendererNode) {
                return "translate(" + rendererNode.position + ")";
            });
        })
        .on("dragend", function () {

        });
};