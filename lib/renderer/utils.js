/**
 * Get the graph node from the given svg element for the given key.
 * @param element {Element}
 * @param key {String?}
 * @return {cg.Node|cg.Point|cg.Connection}
 * @private
 */
cg.Renderer.prototype.graphData = function (element, key) {
    key = key || 'node';
    return element.data(key);
};

/**
 * Bind the svg element to the graph node.
 * @param node {cg.Node|cg.Point|cg.Connection}
 * @param element {Element}
 * @param key {String?}
 * @private
 */
cg.Renderer.prototype._bindGraphData = function (node, element, key) {
    key = key || 'node';
    element.data(key, node);
};

/**
 * Handle the drag and drop of the nodes. (group and blocks)
 * @param node {cg.node}
 * @param nodeGroup {Element}
 */
cg.Renderer.prototype._dragNode = function (node, nodeGroup) {
    nodeGroup.drag(
        function move(dx, dy) {
            // Get the previous delta movement
            var ddx = dx - nodeGroup.data('cg.origin.delta').x;
            var ddy = dy - nodeGroup.data('cg.origin.delta').y;
            // Save the current delta movement
            nodeGroup.data('cg.origin.delta').assign(dx, dy);
            // Move the node (apply zoom)
            node.position.add(new pandora.Vec2(this._zoom.get(ddx), this._zoom.get(ddy)));
            // Emit that the node moved
            node.emit("move");
            // If node is a group, also emit the move for all children
            if (node instanceof cg.Group) {
                //noinspection JSUnresolvedFunction
                node.forEachChild(function (childNode) {
                    childNode.emit("move");
                });
            }
        }.bind(this),
        function start(x, y, e) {
            // Move the node to the graph
            if (node.parent !== this._graph) {
                this._graph.moveNode(node, this._graph);
            }
            if (node instanceof cg.Block) {
                // Move the nodeGroup to the selection layer
                nodeGroup.appendTo(this._selectionLayer);
            } else if (node instanceof cg.Group) {
                // Move the nodeGroup to the front
                nodeGroup.appendTo(this._groupLayer);
            }
            // Cancel mouse propagation
            pandora.preventCallback(e);
            // Save the previous delta movement
            nodeGroup.data('cg.origin.delta', new pandora.Vec2());
            // Selection
            if (!e.shiftKey) {
                this.allElements().forEach(function (element) {
                    element.removeClass("selected");
                });
            }
            nodeGroup.addClass("selected");
        }.bind(this),
        function end() {
            // Drop the element in the nearest group
            var dropElements = this._groupLayer.selectAll(".group").items;
            // Invert browse as the top-most item is the best bet
            for (var i = dropElements.length - 1; i >= 0; --i) {
                // Get the node associated with the item
                var dropGroup = this.graphData(dropElements[i]);
                // Get the bounding box of the node
                var nodeBox = new pandora.Box2(nodeGroup.getBBox());
                // Check if the dropNode is a group and if they intersect
                if (dropGroup !== node && dropGroup instanceof cg.Group && dropGroup.box.contain(nodeBox)) {
                    // Change parent
                    if (dropGroup !== node && dropGroup instanceof cg.Group && dropGroup.box.contain(nodeBox)) {
                        // Add the node to the dropNode
                        this._graph.moveNode(node, dropGroup);
                    }
                }
            }
            // Put the action back in tha action layer
            if (node instanceof cg.Block) {
                nodeGroup.appendTo(this._blockLayer);
            }
        }.bind(this)
    );
};