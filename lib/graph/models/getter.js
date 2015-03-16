cg.Getter = (function () {

    /**
     * Get a global variable of the blueprint.
     * @param data {Object} some JSON data to represent the model
     * @extends cg.Model
     * @constructor
     */
    return pandora.class_("Getter", cg.Model, function (data) {
        cg.Model.call(this, data.name, [], [{"name": data.name, "type": data["value-type"]}], "getter");

        /**
         * Shortcut to get the valueType of the picker.
         * @type {String}
         */
        Object.defineProperty(this, "valueType", {
            get: function () { return this._outputs[0].type; }
        });

    });

})();