cg.Model = (function () {

    /**
     * Represent an action model, aka how an Action node will be created
     * @param name {String} the action's name
     * @param inputs {Array<Object<String, String>>} the parameters
     * @param outputs {Array<Object<String, String>>} the returned values
     * @param type {String?} to specify a type of action (getters for instance)
     * @constructor
     */
    function Model(name, inputs, outputs, type) {
        this._type = type || "action";
        this._name = name;
        this._inputs = inputs || [];
        this._outputs = outputs || [];
    }

    Model.prototype.__proto__ = {
        get name() { return this._name; },
        get inputs() { return this._inputs; },
        get outputs() { return this._outputs; },
        get type() { return this._type; }
    };

    return Model;

})();

