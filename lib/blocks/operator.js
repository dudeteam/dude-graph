cg.Operator = (function () {

    /**
     * This block represents a simple Operator that takes some inputs and returns one or zero output.
     * @extends {cg.Block}
     * @param {cg.Graph} cgGraph
     * @param {Object} data
     * @constructor
     */
    var Operator = pandora.class_("Operator", cg.Block, function (cgGraph, data) {
        cg.Block.call(this, cgGraph, data);
        if (this.cgInputs.length !== 2) {
            throw new Error("Operator `" + this.cgId + "` must only take 2 inputs");
        }
        if (this.cgOutputs.length !== 1) {
            throw new Error("Operator `" + this.cgId + "` must return one value");
        }
    });

    /**
     * Operator factory
     * @param {cg.Graph} cgGraph
     * @param {Object} data
     */
    Operator.buildBlock = function (cgGraph, data) {
        return new Operator(cgGraph, _.merge(data, {
            "cgOutputs": data.cgReturn ? [{
                cgType: "Point",
                cgName: "value",
                cgValueType: data.cgReturn.cgValueType,
                cgTemplate: data.cgReturn.cgTemplate
            }] : null
        }, cg.ArrayMerger));
    };

    return Operator;

})();