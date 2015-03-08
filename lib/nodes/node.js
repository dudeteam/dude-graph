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
    function Node(_id, _type, name, position, data) {
        cg.EventEmitter.call(this);
        this.__id = _id;
        this.__type = _type;
        this._name = name;
        this._parent = null;
        this._position = position;
        this._data = data || {};
    }

    cg.inherit(Node, cg.EventEmitter);

    Node.prototype.__proto__ = {
        get _id() { return this.__id; },
        get _type() { return this.__type; },
        get name() { return this._name; },
        get parent() { return this._parent; },
        set parent(parent) { this._parent = parent; },
        get position() { return this._position; },
        set position(position) { this._position = position; },
        get data() { return this._data; },
        set data(data) { this._data = data; },
        get graph() {
            var node = this;
            while (node) {
                if (!node.parent) {
                    return node;
                }
                node = node.parent;
            }
            return null;
        }
    };

    /**
     * Remove the node from the graph.
     */
    Node.prototype.remove = function() {
        if (!this._parent) {
            this.graph.emit("error", new cg.GraphError("Cannot remove graph node", this));
            return false;
        }
        this.emit("remove");
        this.graph.emit("node.remove", this);
        this._parent.removeChild(this, true);
    };

    /**
     * Return the absolute position of the node.
     * @returns {cg.Vec2}
     */
    Node.prototype.absolutePosition = function () {
        var position = new cg.Vec2(0, 0);
        var node = this;
        while (node) {
            position.add(node.position);
            node = node.parent;
        }
        return position;
    };

    return Node;

})();

