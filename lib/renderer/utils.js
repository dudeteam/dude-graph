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
 * @return {cg.Node|cg.Point}
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
    var parentize = function (nodeGroup, parentGroup) {
        nodeGroup.data("cg.parentize.parent", parentGroup);
        var children = parentGroup.data("cg.parentize.children") || [];
        children.push(nodeGroup);
        parentGroup.data("cg.parentize.children", children);
    };
    var unparentize = function (nodeGroup) {
        var parent = nodeGroup.data("cg.parentize.parent");
        if (parent) {
            var children = parent.data("cg.parentize.children") || [];
            var childFound = children.indexOf(nodeGroup);
            if (childFound === -1) {
                throw new cg.GraphError(parent.node, 'contains no child', nodeGroup.node);
            }
            children.splice(childFound, 1);
            parent.data("cg.parentize.children", children);
            nodeGroup.data("cg.parentize.parent", null);
        }
    };
    var sendChildrenToFront = function (parentGroup) {
        var children = parentGroup.data("cg.parentize.children") || [];
        for (var childIndex = 0; childIndex < children.length; ++childIndex) {
            var child = children[childIndex];
            sendChildrenToFront(child);
            child.appendTo(self._groupLayer);
        }
    };
    nodeGroup.drag(
        function move(dx, dy) {
            // Get the previous delta movement
            var ddx = dx - this.data('cg.origin.delta').x;
            var ddy = dy - this.data('cg.origin.delta').y;
            // Save the current delta movement
            this.data('cg.origin.delta').copy(new cg.Vec2(dx, dy));
            // Move the node (apply zoom)
            node.position.add(new cg.Vec2(self._zoom.get(ddx), self._zoom.get(ddy)));
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
            if (node.parent !== self._graph) {
                self._graph.addChild(node);

            }
            if (node instanceof cg.Action) {
                // Move the nodeGroup to the selection layer
                this.appendTo(self._selectionLayer);
            } else if (node instanceof cg.Group) {
                // Move the nodeGroup to the front
                this.appendTo(self._groupLayer);
                // Send children to front
                sendChildrenToFront(this);
                // Unparentize
                unparentize(this);
            }
            // Cancel mouse propagation
            cg.preventCallback(e);
            // Save the previous delta movement
            this.data('cg.origin.delta', new cg.Vec2());
            // Selection
            if (!e.shiftKey) {
                self._paper.selectAll(".action, .group").forEach(function (element) {
                    element.removeClass("selected");
                });
            }
            nodeGroup.addClass("selected");
        },
        function end() {
            // Drop the element in the nearest group
            var dropElements = self._groupLayer.selectAll(".group").items;
            // Invert browse as the top-most item is the best bet
            for (var i = dropElements.length - 1; i >= 0; --i) {
                // Get the node associated with the item
                var dropGroup = self._getNode(dropElements[i]);
                // Get the bounding box of the node
                var nodeBox = new cg.Box2(nodeGroup.getBBox());
                // Check if the dropNode is a group and if they intersect
                if (dropGroup !== node && dropGroup instanceof cg.Group && dropGroup.box.contain(nodeBox)) {
                    // Change parent
                    if (dropGroup !== node && dropGroup instanceof cg.Group && dropGroup.box.contain(nodeBox)) {
                        // Add the node to the dropNode
                        dropGroup.addChild(node);
                        if (node instanceof cg.Group) {
                            // Parentize
                            parentize(nodeGroup, dropElements[i]);
                        }
                    }
                }
            }
            // Put the action back in tha action layer
            if (node instanceof cg.Action) {
                this.appendTo(self._actionLayer);
            }
        }
    );
};