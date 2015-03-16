cg.Action = (function () {

    /**
     * It represents the most generic type of block, it has a list of input and outputs and a name.
     * @param data {Object} some JSON data to represent the model
     * @extends cg.Model
     * @constructor
     */
    return pandora.class_("Action", cg.Model, function (data) {
        cg.Model.call(this, data.name, data.inputs, data.outputs, "action");
    });

})();