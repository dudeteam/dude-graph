cg.Node = (function () {

    /**
     * Represent a node in the graph
     * @param _id {Number|String} the unique id within the graph for this kind of node.
     * @param _type {String}
     * @param data {Object}
     * @constructor
     */
    function Node(_id, _type, data) {
        cg.EventEmitter.call(this);
        this.__id = _id;
        this.__type = _type;
        this._data = data || {};
    }

    cg.mergeObjects(Node.prototype, cg.EventEmitter.prototype);

    Node.prototype.__proto__ = {
        get _id() { return this.__id; },
        get _type() { return this.__type; },
        get data() { return this._data; },
        set data(data) { this._data = data; }
    };

    return Node;

})();

