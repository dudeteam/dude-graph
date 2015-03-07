cg.Group = (function () {

    /**
     * Represent a group instance into the graph, a group is a container for grouping sub-nodes.
     * @param _id {Number|String} the unique id within the graph for this kind of node.
     * @param graph {cg.Graph} the graph.
     * @param parent {cg.Node} parent node.
     * @param name {String} the action name to refer to the action.
     * @param position {cg.Vec2} the position on the screen.
     * @param size {cg.Vec2} the size on the screen.
     * @constructor
     */
    function Group(_id, graph, parent, name, position, size) {
        cg.Node.call(this, _id, cg.functionName(this.constructor), parent, position);
        this._graph = graph;
        this._name = name;
        this._size = size;
        this._children = new cg.Container();
    }

    cg.inherit(Group, cg.Node);

    Group.prototype.__proto__ = {
        get graph() { return this._graph; },
        get model() { return this._model; },
        get name() { return this._name; },
        get size() { return this._size; },
        set size(size) { this._size = size; },
        get box() { return new cg.Box2(this._position, this._size); },
        get children() { return this._children; }
    };

    /**
     * Add the given node.
     * @param node {cg.Node}
     */
    Group.prototype.addChild = function (node) {
        node.changeParent(this);
        this._children.add(node);
    };

    /**
     * Call the callback for each child recursively.
     * @param callback {Function}
     */
    Group.prototype.forEachChild = function (callback) {
        (function next(group) {
            group.children.forEach(function (node) {
                if (callback(node)) {
                    return;
                }
                if (node instanceof cg.Group) {
                    next(node);
                }
            });
        })(this);
    };

    return Group;

})();

