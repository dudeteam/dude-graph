cg.Model = (function () {

    /**
     * Represent an action model.
     * @param name {String} the action's name
     * @param inputs {Array<cg.Point>} the parameters
     * @param outputs {Array<cg.Point>} the returned values
     * @param inStreams {Number}
     * @param outStreams {Number}
     * @constructor
     */
    function Model(name, inputs, outputs, inStreams, outStreams) {
        this._name = name;
        this._inputs = inputs || [];
        this._outputs = outputs || [];
        this._inStreams = inStreams || 0;
        this._outStreams = outStreams || 0;
    }

    Model.prototype = {
        constructor: Model,
        get name() { return this._name; },
        get inputs() { return this._inputs; },
        get outputs() { return this._outputs; },
        get inStreams() { return this._inStreams; },
        get outStreams() { return this._outStreams; }
    };

    return Model;

})();

