cg.Picker = (function () {

    /**
     * Like getter, this model returns only one value. However, its not link to a variable but just contains the
     * actual value.
     * @param data {Object} some JSON data to represent the model
     * @constructor
     */
    function Picker(data) {
        cg.Model.call(this, "picker-" + data["value-type"], [], [{"value": data["value"], "type": data["value-type"]}], "picker");

        /**
         * The current value set into this picker.
         * @type {*}
         * @private
         */
        this._value = data["default"];
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

    }

    cg.inherit(Picker, cg.Model);

    return Picker;

})();