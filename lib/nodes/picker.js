cg.Picker = (function () {

    /**
     * Like getter, this model returns only one value. However, its not link to a variable but just contains the
     * actual value.
     * @param value {Object} the value of the variable
     * @param type {String} the type of the variable
     * @constructor
     */
    function Picker(value, type) {
        cg.Model.call(this, name, [], [{"value": value, "type": type}], "picker");
    }

    cg.inherit(Picker, cg.Model);

    return Picker;

})();