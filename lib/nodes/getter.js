cg.Getter = (function () {

    /**
     * Get a global variable of the blueprint.
     * @param name {String} the name of the variable
     * @param type {String} the value of the variable
     * @constructor
     */
    function Getter(name, type) {
        cg.Model.call(this, name, [], [{"name": name, "type": type}], "getter");
    }

    cg.inherit(Getter, cg.Model);

    return Getter;

})();