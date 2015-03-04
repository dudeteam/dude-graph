cg.Action = (function () {

    /**
     * Represent an action instance into the graph.
     * @param graph {cg.Graph} T
     * @param index {Number} the index within the graph.
     * @param name {String} the action name to refer to the action.
     * @param position {cg.Vec2} the position on the screen.
     * @constructor
     */
    function Action(graph, index, name, position) {
        cg.EventEmitter.call(this);
        this._index = index;
        this._name = name;
        this._position = position;
        this._inputs = {};
        this._outputs = {};
        var model = graph.getModel(name);
        for (var inputIndex = 0; inputIndex < model.inputs.length; ++inputIndex) {
            var inputModel = model.inputs[inputIndex];
            this._inputs[inputModel.name] = new cg.Point(this, inputIndex, inputModel.type, inputModel.name, true);
        }
        for (var outputIndex = 0; outputIndex < model.outputs.length; ++outputIndex) {
            var outputModel = model.outputs[outputIndex];
            this._outputs[outputModel.name] = new cg.Point(this, outputIndex, outputModel.type, outputModel.name, false);
        }
        this._height = Math.max(model.inputs.length, model.outputs.length);
    }

    cg.mergeObjects(Action.prototype, cg.EventEmitter.prototype);

    Action.prototype.__proto__ = {
        get index() { return this._index; },
        get name() { return this._name; },
        get position() { return this._position; },
        set position(position) { this._position = position; },
        get inputs() { return this._inputs; },
        get outputs() { return this._outputs; },
        get height() { return this._height; }
    };

    return Action;

})();

