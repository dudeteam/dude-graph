cg.Getter = (function () {

    /**
     * Get a global variable of the blueprint.
     * @param data {Object} some JSON data to represent the model
     * @constructor
     */
    function Getter(data) {
        cg.Model.call(this, data.name, [], [{"name": data.name, "type": data["value-type"]}], "getter");
    }

    cg.inherit(Getter, cg.Model);

    return Getter;

})();