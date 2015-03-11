cg.Node = (function () {

    /**
     * Represent a node in the graph
     * @param _id {Number|String} the unique id within the graph for this kind of node.
     * @param _type {String}
     * @param name {String}
     * @param position {cg.Vec2}
     * @param data {Object}
     * @constructor
     */
    var Node = pandora.class_("Node", pandora.EventEmitter, function (_id, _type, name, position, data) {
        pandora.EventEmitter.call(this);

        /**
         * Unique identifier for this kinf of node.
         * @type {Number|String}
         * @private
         */
        this.__id = _id;
        Object.defineProperty(this, "_id", {
            get: function () { return this.__id; }.bind(this)
        });

        /**
         * Type of the node.
         * @type {String}
         * @private
         */
        this.__type = _type;
        Object.defineProperty(this, "_type", {
            get: function () { return this.__type; }.bind(this)
        });

        /**
         * Name of the node.
         * @type {String}
         * @private
         */
        this._name = name;
        Object.defineProperty(this, "name", {
            get: function () { return this._name; }.bind(this)
        });

        /**
         * Node parent.
         * @type {cg.Node}
         * @private
         */
        this._parent = null;
        Object.defineProperty(this, "parent", {
            get: function () { return this._parent; }.bind(this),
            set: function (parent) { this._parent = parent; }.bind(this)
        });

        /**
         * Node position.
         * @type {cg.Vec2}
         * @private
         */
        this._position = position || new pandora.Vec2();
        Object.defineProperty(this, "position", {
            get: function () { return this._position; }.bind(this),
            set: function (position) { this._position = position; }.bind(this)
        });

        /**
         * Node absolute position.
         * @returns {cg.Vec2}
         */
        Object.defineProperty(this, "absolutePosition", {
            get: function () {
                var position = new pandora.Vec2(0, 0);
                var node = this;
                while (node) {
                    position.add(node.position);
                    node = node.parent;
                }
                return position;
            }.bind(this)
        });

        /**
         * Node data
         * @type {Object}
         * @private
         */
        this._data = data || {};
        Object.defineProperty(this, "data", {
            get: function () { return this._data; }.bind(this),
            set: function (data) { this._data = data; }.bind(this)
        });

        /**
         * Get the graph instance for this node.
         */
        Object.defineProperty(this, "graph", {
            get: function() {
                var node = this;
                while (node) {
                    if (!node.parent) {
                        return node;
                    }
                    node = node.parent;
                }
                return null;
            }.bind(this)
        });
    });

    /**
     * Change the parent of the node.
     * @protected
     */
    Node.prototype._changeParent = function(newParent) {
        if (!this.parent) {
            this.graph.emit("error", new cg.GraphError("Parent is null"));
            return;
        }
        if (this.parent === newParent) {
            return;
        }
        if (!newParent) {
            this.graph.emit("error", new cg.GraphError("New parent is null"));
            return;
        }
        this.graph.emit("node.change-parent", this, this.parent, newParent);
        this.emit("change-parent", this, this.parent, newParent);
        this.position.add(this.parent.position);
        this.position.subtract(newParent.position);
        this.parent._removeChild(this);
        this.parent = newParent;
    };

    /**
     * Remove the node from the graph.
     * @protected
     */
    Node.prototype._remove = function() {
        this.parent._removeChild(this);
        this.graph.emit("node.remove", this);
        this.emit("remove", this);
    };

    return Node;

})();

