cg.Model = (function () {

    /**
     * Represent a block model, aka how an Block entity will be created
     * @param name {String} the block's name
     * @param inputs {Array<Object<String, String>>} the parameters
     * @param outputs {Array<Object<String, String>>} the returned values
     * @param type {String?} to specify a type of block (getters for instance)
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
         * Model default inputs.
         * @type {Array<cg.Point>}
         * @private
         */
        this._inputs = inputs || [];
        Object.defineProperty(this, "inputs", {
            get: function () { return this._inputs; }.bind(this)
        });

        /**
         * Model default outputs.
         * @type {Array<cg.Point>}
         * @private
         */
        this._outputs = outputs || [];
        Object.defineProperty(this, "outputs", {
            get: function () { return this._outputs; }.bind(this)
        });
    });

})();

