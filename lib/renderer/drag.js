/**
 * Creates the drag and drop behavior on a d3Node
 * @returns {d3.behavior.drag}
 * @private
 */
cg.Renderer.prototype._createDragBehavior = function () {
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
 * Creates the remove parent behavior on double click
 * @returns {d3.behavior.doubleClick}
 * @private
 */
cg.Renderer.prototype._createRemoveParentBehavior = function () {
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
                // renderer._updateSelectedD3Nodes(renderer._getD3NodesFromRendererNodes([rendererNode, rendererGroupParent]));
                // TODO: Optimize
                renderer._updateSelectedD3Nodes(renderer.d3Nodes);
            }
        });
};

/**
 * Creates the placement behavior when a new rendererBlock is added
 * @param d3Block {d3.selection}
 * @private
 */
cg.Renderer.prototype._createPlacementBehavior = function (d3Block) {
    var renderer = this;
    var namespace = ".placement-behavior";
    var disablePlacement = function () {
        renderer._d3Svg.on("mousemove" + namespace, null);
        renderer._d3Svg.on("mousedown" + namespace, null);
    };
    disablePlacement();
    this._d3Svg.on("mousemove" + namespace, function () {
        d3.event.sourceEvent.preventDefault();
        d3Block.datum().position = renderer._getRelativePosition(d3.mouse(this));
        renderer._updateSelectedD3Nodes(d3Block);
    });
    this._d3Svg.on("mousedown" + namespace, function () {
        d3.event.sourceEvent.preventDefault();
        d3.event.sourceEvent.stopPropagation();
        d3Block.datum().position = renderer._getRelativePosition(d3.mouse(this));
        renderer._updateSelectedD3Nodes(d3Block);
        disablePlacement();
    });
};