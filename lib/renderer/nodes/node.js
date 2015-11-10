dudeGraph.RenderNode = function (nodeId) {
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
    Object.defineProperty(this, "nodeFancyName", {
        configurable: true,
        get: function () {
            return this._nodeName + " (#" + this._nodeId + ")";
        }.bind(this)
    });

    /**
     * The node parent
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
            nodeParent.addChildRenderNode(this);
            this._nodeParent = nodeParent;
        }.bind(this)
    });

    /**
     * The node position
     * @type {[Number, Number]}
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
     * @type {[Number, Number]}
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
     * The svg group that holds this renderNode
     * @type {d3.selection}
     * @protected
     */
    this._d3BlockNode = null;
    Object.defineProperty(this, "d3BlockNode", {
        configurable: true,
        get: function () {
            return this._d3BlockNode;
        }.bind(this)
    });
};

/**
 * Creates the d3Node for this renderNode
 * @param {d3.selection} d3BlockNode
 */
dudeGraph.RenderNode.prototype.create = function (d3BlockNode) {
    this._d3BlockNode = d3BlockNode;
};

/**
 * Moves the d3Block
 */
dudeGraph.RenderNode.prototype.move = function () {
    this._d3BlockNode
        .attr("transform", "translate(" + this._nodePosition + ")");
};

/**
 * Updates the d3Block for this renderBlock
 */
dudeGraph.RenderNode.prototype.update = function () {
    this.move();
};

/**
 * Removes the d3Block for this renderBlock
 */
dudeGraph.RenderNode.prototype.remove = function () {
};