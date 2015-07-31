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
            renderer.d3Groups.classed("active", false);
            selection.each(function (rendererNode) {
                (function recurseParents(rendererChildNode) {
                    if (rendererChildNode) {
                        parentsToUpdate.push(rendererChildNode);
                        recurseParents(rendererChildNode.parent);
                    }
                })(rendererNode.parent);
                rendererNode.position[0] += d3.event.dx;
                rendererNode.position[1] += d3.event.dy;

                var rendererGroup = renderer._getBestDropRendererGroupForRendererNode(rendererNode);
                if (rendererGroup) {
                    renderer._getD3NodesFromRendererNodes([rendererGroup]).classed("active", true);
                }
            });
            if (parentsToUpdate.length > 0) {
                renderer._updateSelectedRendererGroups(renderer._getD3NodesFromRendererNodes(parentsToUpdate));
            }
            selection.attr("transform", function (rendererNode) {
                return "translate(" + rendererNode.position + ")";
            });
        })
        .on("dragend", function () {
            var selection = renderer.d3GroupedSelection;
            selection.each(function (rendererNode) {
                // TODO: Refactor this
                // TODO: Add utils to add a block in a parent and updates automatically all positions and groups positioning
                var rendererGroup = renderer._getBestDropRendererGroupForRendererNode(rendererNode);
                if (rendererGroup) {
                    rendererNode.parent = rendererGroup;
                    rendererGroup.children.push(rendererNode);
                    renderer._updateSelectedRendererGroups(renderer._getD3NodesFromRendererNodes([rendererGroup]));
                    (function recurseParents(rendererChildNode) {
                        if (rendererChildNode) {
                            renderer._updateSelectedRendererGroups(renderer._getD3NodesFromRendererNodes([rendererChildNode]));
                            recurseParents(rendererChildNode.parent);
                        }
                    })(rendererGroup.parent);
                }
            });
        });
};