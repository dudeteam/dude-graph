cg.Group = (function () {

    /**
     * Represent an action instance into the graph.
     * @param _id {Number|String} the unique id within the graph for this kind of node.
     * @param graph {cg.Graph} the graph.
     * @param parent {cg.Node} parent node.
     * @param name {String} the action name to refer to the action.
     * @param position {cg.Vec2} the position on the screen.
     * @constructor
     */
    function Group(_id, graph, parent, name, position) {
        cg.Node.call(this, _id, cg.functionName(this.constructor), parent, position);
        this._graph = graph;
        this._name = name;
        this._children = new cg.Container();
    }

    cg.inherit(Group, cg.Node);

    Group.prototype.__proto__ = {
        get graph() { return this._graph; },
        get model() { return this._model; },
        get name() { return this._name; },
        get children() { return this._children; }
    };

    /**
     * Add the given node.
     * @param node {Object}
     */
    Group.prototype.addChild = function (node) {
        this._children.add(node);
    };

    return Group;

})();

