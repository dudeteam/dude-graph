cg.Value = (function () {

    /**
     * Like getter, this model returns only one value. However, its not linked to a variable but just contains the actual value.
     * @param data {{value-type: {String}, value: {Object}}} some JSON data to represent the model
     * @extends cg.Model
     * @constructor
     */
    return pandora.class_("Value", cg.Model, function (data) {
        cg.Model.call(this, "value-" + data["value-type"], [], [{"value": data.value, "type": data["value-type"]}], "value");

        /**
         * The current value set into this picker.
         * @type {*}
         * @private
         */
        this._value = data.value;
        Object.defineProperty(this, "value", {
            get: function () { return this._value; }.bind(this)
        });

        /**
         * Shortcut to get the valueType of the picker.
         * @type {String}
         */
        Object.defineProperty(this, "valueType", {
            get: function () { return this._outputs[0].type; }
        });

    });

})();