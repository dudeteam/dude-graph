/**
 * @param {dudeGraph.Renderer} renderer
 * @param {String} nodeId
 * @constructor
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
     * Returns the node fancyName
     * @type {String}
     */
    Object.defineProperty(this, "nodeFancyName", {
        configurable: true,
        get: function () {
            return this._nodeName + " (#" + this._nodeId + ")";
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
    this._d3Folie = this._d3Node.append("svg:polygon");
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