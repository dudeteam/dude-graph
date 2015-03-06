cg.Graph = (function () {

    /**
     * Represent a graph of connected actions.
     * @constructor
     */
    function Graph() {
        cg.Node.call(this, null, cg.functionName(this.constructor), null, new cg.Vec2(0, 0));

        /**
         * Contains the model of actions that can be created.
         * @type {Object}
         * @private
         */
        this._models = {};

        /**
         * Contains the children nodes.
         * @type {cg.Container<cg.Node>}
         * @private
         */
        this._children = new cg.Container();

    }

    cg.inherit(Graph, cg.Node);

    Graph.prototype.__proto__ = {
        get models() { return this._models; },
        get children() { return this._children; }
    };

    /**
     * Add a model of action.
     * @param model {cg.Model}
     */
    Graph.prototype.addModel = function (model) {
        this._models[model.name] = model;
    };

    /**
     * Get a model from its name.
     * @param name {String}
     */
    Graph.prototype.getModel = function (name) {
        return this._models[name];
    };

    /**
     * Add a node child
     * @param node {cg.Node}
     */
    Graph.prototype.addChild = function (node) {
        this._children.add(node);
    };

    return Graph;

})();