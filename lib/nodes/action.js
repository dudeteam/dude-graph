cg.Action = (function () {

    /**
     * Represent an action instance into the graph.
     * @param _id {Number|String} the unique id within the graph for this kind of node.
     * @param model {cg.Model} the action model.
     * @param position {cg.Vec2} the position on the screen.
     * @constructor
     */
    function Action(_id, model, position) {
        cg.Node.call(this, _id, cg.functionName(this.constructor), model.name, position);
        this._model = model;
        this._inputs = {};
        this._outputs = {};
        this._height = Math.max(model.inputs.length, model.outputs.length);
        this.initialize();
    }

    cg.inherit(Action, cg.Node);

    Action.prototype.__proto__ = {
        get model() { return this._model; },
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

