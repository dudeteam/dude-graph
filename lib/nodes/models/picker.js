cg.Picker = (function () {

    /**
     * Like getter, this model returns only one value. However, its not link to a variable but just contains the
     * actual value.
     * @param data {Object} some JSON data to represent the model
     * @constructor
     */
    function Picker(data) {
        cg.Model.call(this, null, [], [{"value": data["value"], "type": data["value-type"]}], "picker");
    }

    cg.inherit(Picker, cg.Model);

    return Picker;

})();