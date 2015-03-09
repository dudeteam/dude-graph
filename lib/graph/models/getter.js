cg.Getter = (function () {

    /**
     * Get a global variable of the blueprint.
     * @param data {Object} some JSON data to represent the model
     * @constructor
     */
    function Getter(data) {
        cg.Model.call(this, data.name, [], [{"name": data.name, "type": data["value-type"]}], "getter");

        /**
         * Shortcut to get the valueType of the picker.
         * @type {String}
         */
        Object.defineProperty(this, "valueType", {
            get: function () { return this._outputs[0].type; }
        });

    }

    cg.inherit(Getter, cg.Model);

    return Getter;

})();