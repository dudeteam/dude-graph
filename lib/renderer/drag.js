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
            var selection = renderer.d3GroupedSelection;
            var parentsToUpdate = [];
            selection.each(function (rendererNode) {
                (function recurseParents(rendererChildNode) {
                    if (rendererChildNode) {
                        parentsToUpdate.push(rendererChildNode);
                        recurseParents(rendererChildNode.parent);
                    }
                })(rendererNode.parent);
                rendererNode.position[0] += d3.event.dx;
                rendererNode.position[1] += d3.event.dy;
            });
            if (parentsToUpdate.length > 0) {
                renderer._updateSelectedRendererGroups(renderer._getD3NodesFromRendererNodes(parentsToUpdate));
            }
            selection.attr("transform", function (rendererNode) {
                return "translate(" + rendererNode.position + ")";
            });
        })
        .on("dragend", function () {

        });
};