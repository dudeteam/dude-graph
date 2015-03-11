cg.Model = (function () {

    /**
     * Represent an action model, aka how an Action node will be created
     * @param name {String} the action's name
     * @param inputs {Array<Object<String, String>>} the parameters
     * @param outputs {Array<Object<String, String>>} the returned values
     * @param type {String?} to specify a type of action (getters for instance)
     * @constructor
     */
    return pandora.class_("Model", function (name, inputs, outputs, type) {
        /**
         * Model type.
         * @type {Number}
         * @private
         */
        this._type = type;
        Object.defineProperty(this, "type", {
            get: function () { return this._type; }.bind(this)
        });

        /**
         * Name of the model.
         * @type {String}
         * @private
         */
        this._name = name;
        Object.defineProperty(this, "name", {
            get: function () { return this._name; }.bind(this)
        });

        /**
         *
         * @type {Array<cg.Point>}
         * @private
         */
        this._inputs = inputs || [];
        Object.defineProperty(this, "inputs", {
            get: function () { return this._inputs; }.bind(this)
        });

        /**
         *
         * @type {Array<cg.Point>}
         * @private
         */
        this._outputs = outputs || [];
        Object.defineProperty(this, "outputs", {
            get: function () { return this._outputs; }.bind(this)
        });
    });

})();

