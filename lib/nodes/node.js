cg.Node = (function () {

    /**
     * Represent a node in the graph
     * @param _id {Number|String} the unique id within the graph for this kind of node.
     * @param _type {String}
     * @param parent {cg.Node} parent node.
     * @param position {cg.Vec2} node position.
     * @param data {Object}
     * @constructor
     */
    function Node(_id, _type, parent, position, data) {
        cg.EventEmitter.call(this);
        this.__id = _id;
        this.__type = _type;
        this._parent = parent;
        this._position = position;
        this._data = data || {};
    }

    cg.inherit(Node, cg.EventEmitter);

    Node.prototype.__proto__ = {
        get _id() { return this.__id; },
        get _type() { return this.__type; },
        get parent() { return this._parent; },
        get position() { return this._position; },
        set position(position) { this._position = position; },
        get data() { return this._data; },
        set data(data) { this._data = data; }
    };

    /**
     * Return the absolute position of the node.
     * @returns {cg.Vec2}
     */
    Node.prototype.getAbsolutePosition = function () {
        var position = new cg.Vec2(0, 0);
        var node = this;
        while (node) {
            position.x += node.position.x;
            position.y += node.position.y;
            node = node.parent;
        }
        return position;
    };

    return Node;

})();

