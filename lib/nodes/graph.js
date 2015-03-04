cg.Graph = (function () {

    /**
     * Represent a graph of connected actions.
     * @constructor
     */
    function Graph() {

        cg.EventEmitter.call(this);

        /**
         * Contains the actions instances.
         * @type {cg.Container<cg.Action>}
         * @private
         */
        this._actions = new cg.Container();

        /**
         * Contains all the connections between actions instances.
         * @type {cg.Container<cg.Connection>}
         * @private
         */
        this._connections = new cg.Container();

        /**
         * Contains the model of actions that can be created.
         * @type {Object}
         * @private
         */
        this._models = {};

    }

    cg.mergeObjects(Graph.prototype, cg.EventEmitter.prototype);

    Graph.prototype.__proto__ = {
        get models() { return this._models; },
        get actions() { return this._actions; },
        get connections() { return this._connections; }
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
     * Add an action instance.
     * @param action {cg.Action}
     */
    Graph.prototype.addAction = function (action) {
        this._actions.push(action);
    };

    /**
     * Add a connection between two points.
     * @param firstPoint {cg.Point}
     * @param secondPoint {cg.Point}
     */
    Graph.prototype.addConnection = function (firstPoint, secondPoint) {
        this._connections.push(new cg.Connection(firstPoint, secondPoint));
    };

    return Graph;

})();