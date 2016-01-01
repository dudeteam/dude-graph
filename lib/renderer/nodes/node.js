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
    this._getNodeName = function () {
        return this._nodeName;
    }.bind(this);
    this._setNodeName = function (nodeName) {
        this._nodeName = nodeName;
        if (this._d3Node !== null) {
            this.computePosition();
            this.computeSize();
            this.update();
        }
    }.bind(this);
    Object.defineProperty(this, "nodeName", {
        configurable: true,
        get: this._getNodeName,
        set: this._setNodeName
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
     * The offset position
     * @type {Array<Number>}
     * @protected
     */
    this._movePosition = [0, 0];
    Object.defineProperty(this, "movePosition", {
        configurable: true,
        get: function () {
            return this._movePosition;
        }.bind(this),
        set: function (_movePosition) {
            this._movePosition = _movePosition;
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
 * Applies dom events on node renderNode in order to select and move it.
 */
dudeGraph.RenderNode.prototype.moveEvent = function () {
    var renderNode = this;
    this._d3Node.call(d3.behavior.drag()
        .on("dragstart", function () {
            _.stopD3ImmediatePropagation();
            _.preventD3Default();
            if (!d3.event.sourceEvent.shiftKey) {
                renderNode._renderer.clearSelection();
            }
            renderNode._renderer.addToSelection([renderNode]);
            this.parentNode.appendChild(this);
        })
        .on("drag", function () {
            _.preventD3Default();
            var translateRenderNode = function (currentRenderNode) {
                if (renderNode._renderer._config.grid.active) {
                    currentRenderNode.movePosition[0] += d3.event.dx;
                    currentRenderNode.movePosition[1] += d3.event.dy;
                    currentRenderNode.nodePosition[0] = Math.round(currentRenderNode.movePosition[0] / renderNode._renderer._config.grid.spacingX) * renderNode._renderer._config.grid.spacingX;
                    currentRenderNode.nodePosition[1] = Math.round(currentRenderNode.movePosition[1] / renderNode._renderer._config.grid.spacingY) * renderNode._renderer._config.grid.spacingY;
                } else {
                    currentRenderNode.nodePosition[0] += d3.event.dx;
                    currentRenderNode.nodePosition[1] += d3.event.dy;
                }
                currentRenderNode.move();
                _.forEach(currentRenderNode._renderPoints, function (renderPoint) {
                    _.forEach(renderPoint.renderConnections, function (renderConnection) {
                        renderConnection.update();
                    });
                });
            };
            translateRenderNode(renderNode);
            if (renderNode instanceof dudeGraph.RenderGroup) {
                _.forEach(renderNode.renderBlocksChildren, function (childRenderNode) {
                    translateRenderNode(childRenderNode);
                });
            } else {
                var renderGroupParent = renderNode.renderGroupParent;
                if (renderGroupParent !== null) {
                    renderGroupParent.computePosition();
                    renderGroupParent.computeSize();
                    renderGroupParent.update();
                }
            }
        })
        .on("dragend", function (renderNode) {
            _.preventD3Default();
            if (renderNode instanceof dudeGraph.RenderBlock && renderNode.renderGroupParent === null) {
                var renderGroup = renderNode._renderer.nearestRenderGroup(renderNode);
                if (renderGroup !== null) {
                    renderNode.renderGroupParent = renderGroup;
                    renderGroup.computePosition();
                    renderGroup.computeSize();
                    renderGroup.update();
                }
            }
        })
    );
};