cg.Action = (function () {

    /**
     * Represent an action block into the graph.
     * @param name {String} name to refer to the action.
     * @param position {cg.Vec2} the position on the screen.
     * @param inputs {Array<cg.Point>} input parameters.
     * @param outputs {Array<cg.Point>} values returned by the action.
     * @param stream {String} in, out, inout or undefined to specify whether to add the action into a stream.
     * @constructor
     */
    function Action(name, position, inputs, outputs, stream) {
        this._name = name;
        this._position = position;
        this._inputs = inputs;
        this._outputs = outputs;
        this._stream = stream;
    }

    Action.prototype = {
        get name() { return this._name; },
        get position() { return this._position; },
        set position(position) { this._position = position; },
        get inputs() { return this._inputs; },
        get outputs() { return this._outputs; },
        get stream() { return this._stream; }
    };

    return Action;

})();

