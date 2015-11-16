/**
 * @param {dudeGraph.Renderer} renderer
 * @param {String} nodeId
 * @class
 */
dudeGraph.RenderNode = function (renderer, nodeId) {
    /**
     * Reference on the renderer
     * @type {dudeGraph.Renderer}
     * @protected
     */
    this._renderer = renderer;

    /**
     * The node id
     * @type {String}
     * @protected
     */
    this._nodeId = nodeId;
    Object.defineProperty(this, "nodeId", {
        configurable: true,
        get: function () {
            return this._nodeId;
        }.bind(this)
    });

    /**
     * The node name
     * @type {String}
     * @protected
     */
    this._nodeName = null;
    Object.defineProperty(this, "nodeName", {
        configurable: true,
        get: function () {
            return this._nodeName;
        }.bind(this),
        set: function (nodeName) {
            this._nodeName = nodeName;
        }.bind(this)
    });

    /**
     * The node renderGroup parent
     * @type {dudeGraph.RenderGroup}
     * @protected
     */
    this._nodeParent = null;
    Object.defineProperty(this, "nodeParent", {
        configurable: true,
        get: function () {
            return this._nodeParent;
        }.bind(this),
        set: function (nodeParent) {
            if (this._nodeParent !== null) {
                this._nodeParent.removeChildRenderNode(this);
            }
            if (nodeParent !== null) {
                nodeParent.addChildRenderNode(this);
            }
            this._nodeParent = nodeParent;
        }.bind(this)
    });

    /**
     * The node position
     * @type {Array<Number>}
     * @protected
     */
    this._nodePosition = [0, 0];
    Object.defineProperty(this, "nodePosition", {
        configurable: true,
        get: function () {
            return this._nodePosition;
        }.bind(this),
        set: function (nodePosition) {
            this._nodePosition = nodePosition;
        }.bind(this)
    });

    /**
     * The node size
     * @type {Array<Number>}
     * @protected
     */
    this._nodeSize = [0, 0];
    Object.defineProperty(this, "nodeSize", {
        configurable: true,
        get: function () {
            return this._nodeSize;
        }.bind(this),
        set: function (nodeSize) {
            this._nodeSize = nodeSize;
        }.bind(this)
    });

    /**
     * The d3Node that holds this renderNode
     * @type {d3.selection}
     * @protected
     */
    this._d3Node = null;
    Object.defineProperty(this, "d3Node", {
        configurable: true,
        get: function () {
            return this._d3Node;
        }.bind(this)
    });

    /**
     * Returns the node fancyName
     * @type {String}
     */
    Object.defineProperty(this, "nodeFancyName", {
        configurable: true,
        get: function () {
            return this._nodeName + " (#" + this._nodeId + ")";
        }.bind(this)
    });
};

/**
 * Creates the svg representation of this renderNode
 * @param {d3.selection} d3Node
 */
dudeGraph.RenderNode.prototype.create = function (d3Node) {
    this._d3Node = d3Node;
};

/**
 * Moves the svg representation of this renderNode
 */
dudeGraph.RenderNode.prototype.move = function () {
    this._d3Node
        .attr("transform", "translate(" + this._nodePosition + ")");
};

/**
 * Updates the svg representation of this renderNode
 */
dudeGraph.RenderNode.prototype.update = function () {
    this.move();
};

/**
 * Removes the svg representation of this renderNode
 */
dudeGraph.RenderNode.prototype.remove = function () {
};

/**
 * Called when the renderNode is selected
 * @callback
 */
dudeGraph.RenderNode.prototype.select = function () {
    this._d3Folie = this._d3Node.append("svg:polygon")
        .attr("fill", this._renderer.config.defaultColor);
    this._d3Folie.attr("points", function () {
        var starPoints = [];
        var pins = 5;
        var angle = Math.PI / pins;
        for (var i = 0; i < pins * 2; i++) {
            var radius = (i % 2) === 0 ? 5 : 10;
            var x = 5 + Math.cos(i * angle) * radius;
            var y = 5 + Math.sin(i * angle) * radius;
            starPoints.push([x, y]);
        }
        return starPoints;
    });
};

/**
 * Called when the renderNode is unselected
 * @callback
 */
dudeGraph.RenderNode.prototype.unselect = function () {
    this._d3Folie.remove();
};

/**
 * Called when the renderNode should compute its new position
 */
dudeGraph.RenderNode.prototype.computePosition = function () {

};

/**
 * Called when the renderNode should compute its new size
 */
dudeGraph.RenderNode.prototype.computeSize = function () {

};

/**
 * Applies dom events on this renderNode in order to remove it from its parent.
 */
dudeGraph.RenderNode.prototype.removeParentEvent = function () {
    var renderNode = this;
    this._d3Node.call(d3.behavior.doubleClick()
        .on("dblclick", function () {
            var nodeParent = renderNode.nodeParent;
            if (nodeParent !== null) {
                _.stopD3ImmediatePropagation();
                renderNode.nodeParent = null;
                nodeParent.computePosition();
                nodeParent.computeSize();
                nodeParent.update();
            }
        })
    );
};

/**
 * Applies dom events on node renderNode in order to select and move it.
 */
dudeGraph.RenderNode.prototype.moveEvent = function () {
    var renderNode = this;
    this._d3Node.call(d3.behavior.drag()
        .on("dragstart", function () {
            _.stopD3ImmediatePropagation();
            if (!d3.event.sourceEvent.shiftKey) {
                renderNode._renderer.clearSelection();
            }
            renderNode._renderer.addToSelection([renderNode]);
            this.parentNode.appendChild(this);
        })
        .on("drag", function () {
            (function updatePosition(currentRenderNode) {
                currentRenderNode.nodePosition[0] += d3.event.dx;
                currentRenderNode.nodePosition[1] += d3.event.dy;
                currentRenderNode.move();
                _.forEach(currentRenderNode._renderPoints, function (renderPoint) {
                    _.forEach(renderPoint.renderConnections, function (renderConnection) {
                        renderConnection.update();
                    });
                });
                if (currentRenderNode._childrenRenderNodes) {
                    _.forEach(currentRenderNode._childrenRenderNodes, function (childRenderNode) {
                        updatePosition(childRenderNode);
                    });
                }
            })(renderNode);
            var currentParentNode = renderNode.nodeParent;
            while (currentParentNode !== null) {
                currentParentNode.computePosition();
                currentParentNode.computeSize();
                currentParentNode.update();
                currentParentNode = currentParentNode.nodeParent;
            }
        })
    );
};