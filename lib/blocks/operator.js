cg.Operator = (function () {

    /**
     * This block represents a simple Operator that takes some inputs and returns one or zero output.
     * @extends {cg.Block}
     * @param {cg.Graph} cgGraph
     * @param {Object} data
     * @constructor
     */
    var Operator = pandora.class_("Operator", cg.Block, function (cgGraph, data) {
        cg.Block.call(this, cgGraph, {
            cgId: data.cgId,
            cgName: data.cgName,
            cgModel: data.cgModel,
            cgInputs: data.cgInputs,
            cgOutputs: data.cgReturn ? [{
                cgType: "Point",
                cgName: "value",
                cgValueType: data.cgReturn.cgValueType,
                cgTemplate: data.cgReturn.cgTemplate
            }] : null
        });
        if (data.cgInputs.length != 2) {
            throw new Error("Operator `" + this.cgId + "` should only take 2 inputs");
        }
        if (!data.cgReturn) {
            throw new Error("Operator `" + this.cgId + "` should return a value");
        }
    });

    /**
     * Operator factory
     * @param {cg.Graph} cgGraph
     * @param {Object} data
     */
    Operator.buildBlock = function (cgGraph, data) {
        return new Operator(cgGraph, data);
    };

    return Operator;

})();