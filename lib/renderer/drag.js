/**
 * Creates the drag and drop behavior on a d3Node
 * @returns {d3.behavior.drag}
 * @private
 */
cg.Renderer.prototype._createDragBehavior = function () {
    var renderer = this;
    return d3.behavior.drag()
        .on("dragstart", function () {
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
            renderer._computeRendererGroupsPositionAndSize();
            renderer._updateSelectedD3Nodes(selection);
            var rendererGroup = renderer._getBestDropRendererGroupForRendererNode(d3.select(this).datum());
            renderer.d3Nodes.classed("cg-active", false);
            if (rendererGroup) {
                renderer._getD3NodesFromRendererNodes([rendererGroup]).classed("cg-active", true);
            }
        })
        .on("dragend", function () {
            var selection = renderer.d3Selection;
            var rendererGroup = renderer._getBestDropRendererGroupForRendererNode(d3.select(this).datum());
            renderer.d3Nodes.classed("cg-active", false);
            if (rendererGroup) {
                selection.each(function (rendererNode) {
                    renderer._addRendererNodeParent(rendererNode, rendererGroup);
                });
                renderer._computeRendererGroupPositionAndSize(rendererGroup);
            }
            renderer._updateSelectedD3Nodes(selection);
        });
};