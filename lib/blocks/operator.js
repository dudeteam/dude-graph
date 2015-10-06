dudeGraph.Operator = (function () {

    /**
     * This block represents a simple Operator that takes some inputs and returns one or zero output.
     * @extends {dudeGraph.Block}
     * @param {dudeGraph.Graph} cgGraph
     * @param {Object} data
     * @constructor
     */
    var Operator = pandora.class_("Operator", dudeGraph.Block, function (cgGraph, data) {
        dudeGraph.Block.call(this, cgGraph, data, "Operator");
        if (this.cgInputs.length !== 2) {
            throw new Error("Operator `" + this.cgId + "` must only take 2 inputs");
        }
        if (this.cgOutputs.length !== 1) {
            throw new Error("Operator `" + this.cgId + "` must return one value");
        }
    });

    /**
     * Operator factory
     * @param {dudeGraph.Graph} cgGraph
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
        }, dudeGraph.ArrayMerger));
    };

    return Operator;

})();