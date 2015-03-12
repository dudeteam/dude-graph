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
    var delta = new pandora.Vec2();
    nodeGroup.drag(
        function move(dx, dy) {
            delta.assign(this._zoom.get(dx), this._zoom.get(dy));
            this.selectedNodes().forEach(function (selectedNode) {
                selectedNode.position = selectedNode.data["cg-origin"].clone().add(delta);
                selectedNode.emit("move");
                if (selectedNode instanceof cg.Group) {
                    selectedNode.forEachChild(function (childNode) {
                        childNode.emit("move");
                    });
                }
            }.bind(this));
        }.bind(this),
        function start(x, y, e) {
            pandora.preventCallback(e);
            if (!e.shiftKey && !nodeGroup.hasClass("selected")) {
                this.allElements().forEach(function (element) {
                    element.removeClass("selected");
                });
            }
            nodeGroup.addClass("selected");
            this.selectedNodes().forEach(function (selectedNode) {
                if (selectedNode.parent !== this._graph) {
                    this._graph.moveNode(selectedNode, this._graph);
                }
                selectedNode.data["cg-origin"] = selectedNode.position.clone();
            }.bind(this));
            this.selectedElements().forEach(function (selectedElement) {
                selectedElement.appendTo(selectedElement.parent());
            });
        }.bind(this),
        function end() {
            var selectedElements = this.selectedElements();
            this.allGroups().forEach(function (dropGroupElement) {
                var dropGroup = this.graphData(dropGroupElement);
                selectedElements.forEach(function (selectedElement) {
                    var selectedNode = this.graphData(selectedElement);
                    var selectedNodeBox = new pandora.Box2(selectedElement.getBBox());
                    if (dropGroup !== selectedNode && dropGroup.box.contain(selectedNodeBox)) {
                        this._graph.moveNode(selectedNode, dropGroup);
                    }
                }.bind(this));
            }.bind(this));
            this.selectedNodes().forEach(function (selectedNode) {
                delete selectedNode.data["cg-origin"];
            });
        }.bind(this)
    );
};