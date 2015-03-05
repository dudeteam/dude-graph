cg.Action = (function () {

    /**
     * Represent an action instance into the graph.
     * @param _id {Number|String} the unique id within the graph for this kind of node.
     * @param graph {cg.Graph} the graph.
     * @param model {cg.Model} the action model.
     * @param position {cg.Vec2} the position on the screen.
     * @constructor
     */
    function Action(_id, graph, model, position) {
        cg.Node.call(this, _id, this.constructor.name);
        this._graph = graph;
        this._model = model;
        this._name = model.name;
        this._position = position;
        this._inputs = {};
        this._outputs = {};
        this._height = Math.max(model.inputs.length, model.outputs.length);
        this.initialize();
    }

    cg.mergeObjects(Action.prototype, cg.Node.prototype);

    Action.prototype.__proto__ = {
        get graph() { return this._graph; },
        get model() { return this._model; },
        get name() { return this._name; },
        get position() { return this._position; },
        set position(position) { this._position = position; },
        get inputs() { return this._inputs; },
        get outputs() { return this._outputs; },
        get height() { return this._height; }
    };

    Action.prototype.initialize = function() {
        for (var inputIndex = 0; inputIndex < this._model.inputs.length; ++inputIndex) {
            var inputModel = this._model.inputs[inputIndex];
            this._inputs[inputModel.name] = new cg.Point(this, inputIndex, inputModel.type, inputModel.name, true);
        }
        for (var outputIndex = 0; outputIndex < this._model.outputs.length; ++outputIndex) {
            var outputModel = this._model.outputs[outputIndex];
            this._outputs[outputModel.name] = new cg.Point(this, outputIndex, outputModel.type, outputModel.name, false);
        }
    };

    return Action;

})();

