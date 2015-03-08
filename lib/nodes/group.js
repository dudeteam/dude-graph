cg.Group = (function () {

    /**
     * Represent a group instance into the graph, a group is a container for grouping sub-nodes.
     * @param _id {Number|String} the unique id within the graph for this kind of node.
     * @param name {String} the action name to refer to the action.
     * @param position {cg.Vec2} the position on the screen.
     * @param size {cg.Vec2} the size on the screen.
     * @constructor
     */
    function Group(_id, name, position, size) {
        cg.Node.call(this, _id, cg.functionName(this.constructor), name, position);
        this._size = size;
        this._children = new cg.Container();
    }

    cg.inherit(Group, cg.Node);

    Group.prototype.__proto__ = {
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
        if (node.parent === this) {
            this.graph.emit("error", new Error("Cannot add node as child is the node is already a child", this, node));
            return ;
        }
        if (node.parent) {
            node.changeParent(this);
        }
        node.parent = this;
        this._children.add(node);
    };

    /**
     * Remove the given node from the group.
     * @param node {cg.Node}
     */
    Group.prototype.removeChild = function (node) {
        this._children.remove(node);
    };

    /**
     * Remove the group from the graph.
     */
    Group.prototype.remove = function() {
        (function next(children) {
            var child = children[0];
            if (child) {
                child.remove();
            }
            if (children[0] !== child) {
                next(children);
            }
        })(this._children._nodes);
        cg.Node.prototype.remove.call(this);
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

