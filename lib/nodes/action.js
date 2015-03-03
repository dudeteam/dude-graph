cg.Action = (function () {

    /**
     * Represent an action instance into the graph.
     * @param graph {cg.Graph} T
     * @param name {String} name to refer to the action.
     * @param position {cg.Vec2} the position on the screen.
     * @constructor
     */
    function Action(graph, name, position) {
        this._name = name;
        this._position = position;
        this._model = graph.getModel(name);
    }

    Action.prototype.__proto__ = {
        get name() { return this._name; },
        get position() { return this._position; },
        set position(position) { this._position = position; },
        get model() { return this._model; }
    };

    return Action;

})();

