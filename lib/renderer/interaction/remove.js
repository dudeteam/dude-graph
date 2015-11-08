/**
 * Removes all connection from a d3Point when clicking and pressing alt
 * @returns {d3.behavior.click}
 * @private
 */
dudeGraph.Renderer.prototype._removeRendererConnectionBehavior = function () {
    var renderer = this;
    return d3.behavior.mousedown()
        .on("mousedown", function (rendererPoint) {
            if (d3.event.sourceEvent.altKey) {
                d3.event.sourceEvent.preventDefault();
                d3.event.sourceEvent.stopImmediatePropagation();
                renderer._removeRendererPointRendererConnections(rendererPoint);
                renderer._removeD3Connections();
                // TODO: Optimize
                renderer._updateD3Blocks();
            }
        });
};

/**
 * Removes the rendererNode from his parent on double click
 * @returns {d3.behavior.doubleClick}
 * @private
 */
dudeGraph.Renderer.prototype._removeRendererNodeFromParentBehavior = function () {
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