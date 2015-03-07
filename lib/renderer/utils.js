/**
 * Set the data-binding between the node and the element with the given key.
 * @param node {cg.Node}
 * @param element {Element}
 * @param key {String?}
 * @private
 */
cg.Renderer.prototype._dataBinding = function (node, element, key) {
    key = key || 'node';
    element.data(key, node);
};

/**
 * Get the node from the given element for the given key.
 * @param element {Element}
 * @param key {String?}
 * @return {cg.Node}
 * @private
 */
cg.Renderer.prototype._getNode = function (element, key) {
    key = key || 'node';
    return element.data(key);
};

/**
 *
 * @param node {cg.node}
 * @param nodeGroup {Element}
 */
cg.Renderer.prototype._dragNode = function (node, nodeGroup) {
    var self = this;
    nodeGroup.drag(
        function move(dx, dy) {
            // Get the previous delta movement
            var ddx = dx - nodeGroup.data('cg.origin.dx');
            var ddy = dy - nodeGroup.data('cg.origin.dy');
            // Save the current delta movement
            nodeGroup.data('cg.origin.dx', dx);
            nodeGroup.data('cg.origin.dy', dy);
            // Move the node
            node.position.x += ddx;
            node.position.y += ddy;
            // Emit that the node moved
            node.emit("move");
            // If node is a group, also emit the move for all children
            if (node instanceof cg.Group) {
                //noinspection JSUnresolvedFunction
                node.forEachChild(function (childNode) {
                    childNode.emit("move");
                });
            }
        },
        function start(x, y, e) {
            // Move the node to the graph
            self._graph.addChild(node);
            if (node instanceof cg.Action) { // Move the nodeGroup to the selection layer if action
                nodeGroup.appendTo(self._selectionLayer);
            } else if (node instanceof cg.Group) {
                // TODO: move children to front of this nodeGroup
                nodeGroup.appendTo(self._groupLayer); // Move the nodeGroup to the front if group
            }
            // Cancel mouse propagation
            cg.preventCallback(e);
            // Save the previous delta movement
            nodeGroup.data('cg.origin.dx', 0);
            nodeGroup.data('cg.origin.dy', 0);
        },
        function end() {
            // Drop the element in the nearest group
            var dropElements = self._groupLayer.selectAll(".group").items;
            // Invert browse as the top-most item is the best bet
            for (var i = dropElements.length - 1; i >= 0; --i) {
                // Get the node associated with the item
                var dropGroup = self._getNode(dropElements[i]);
                // Get the bounding box of the node
                var nodeBox = nodeGroup.getBBox();
                if (node instanceof cg.Action) {
                    nodeBox = nodeGroup.getBBox();
                } else if (node instanceof cg.Group) {
                    nodeBox = node.box;
                }
                // Check if the dropNode is a group and if they intersect
                if (dropGroup !== node && dropGroup instanceof cg.Group && cg.boxesCollide(dropGroup.box, nodeBox)) {
                    // Change parent
                    dropGroup.addChild(node);
                }
            }
        }
    );
};