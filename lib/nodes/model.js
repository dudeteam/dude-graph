cg.Model = (function () {

    /**
     * Represent an action model, aka how an Action node will be created
     * @param name {String} the action's name
     * @param inputs {Array<Object<String, String>>} the parameters
     * @param outputs {Array<Object<String, String>>} the returned values
     * @constructor
     */
    function Model(name, inputs, outputs) {
        this._name = name;
        this._inputs = inputs || [];
        this._outputs = outputs || [];
    }

    Model.prototype = {
        constructor: Model,
        get name() { return this._name; },
        get inputs() { return this._inputs; },
        get outputs() { return this._outputs; }
    };

    return Model;

})();

