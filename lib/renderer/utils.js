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
 * Return an event point in SVG coordinates.
 * @param x
 * @param y
 * @return {pandora.Vec2}
 * @private
 */
cg.Renderer.prototype._positionToSvg = function (x, y) {
    this._paperPoint.x = x;
    this._paperPoint.y = y;
    var position = this._paperPoint.matrixTransform(this._rootElement.node.getCTM().inverse());
    return new pandora.Vec2(position);
};

/**
 * Handle the drag and drop of the nodes. (group and blocks)
 * @param node {cg.node}
 * @param nodeGroup {Element}
 */
cg.Renderer.prototype._dragNode = function (node, nodeGroup) {
    var delta = new pandora.Vec2();
    interact(nodeGroup.node)
        .on('down', function (event) {
            pandora.preventCallback(event);
            if (!event.shiftKey && !nodeGroup.hasClass("selected")) {
                this.allElements().forEach(function (element) {
                    element.removeClass("selected");
                });
            }
            nodeGroup.addClass("selected");
            this.selectedNodes().forEach(function (selectedNode) {
                if (selectedNode.parent !== this._graph) {
                    this._graph.moveNode(selectedNode, this._graph);
                }
                selectedNode.emit("reorder");
            }.bind(this));
        }.bind(this))
        .draggable({
            onmove: function (event) {
                delta.assign(this._zoom.get(event.dx), this._zoom.get(event.dy));
                this.selectedNodes().forEach(function (selectedNode) {
                    selectedNode.position.add(delta);
                    selectedNode.emit("move");
                    if (selectedNode instanceof cg.Group) {
                        selectedNode.forEachChild(function (childNode) {
                            childNode.emit("move");
                        });
                    }
                });
            }.bind(this),
            onend: function () {
                var selectedElements = this.selectedElements();
                this.allGroups().forEach(function (dropGroupElement) {
                    var dropGroup = this.graphData(dropGroupElement);
                    selectedElements.forEach(function (selectedElement) {
                        var selectedNode = this.graphData(selectedElement);
                        var selectedNodeBox = this._box2.assign(selectedElement.getBBox());
                        if (dropGroup !== selectedNode && dropGroup.box.contain(selectedNodeBox)) {
                            this._graph.moveNode(selectedNode, dropGroup);
                        }
                    }.bind(this));
                }.bind(this));
            }.bind(this)
        });
    /**
        .resizable({
            edges: {left: true, right: true, bottom: true, top: true}
        })
        .on('resizemove', function (event) {
            node.position.x = this._positionToSvg(event.rect.left, 0).x;
            node.position.y = this._positionToSvg(0, event.rect.top).y;
            node.size.x = this._zoom.get(event.rect.width);
            node.size.y = this._zoom.get(event.rect.height);
            node.emit("move");
        }.bind(this));
     **/
};