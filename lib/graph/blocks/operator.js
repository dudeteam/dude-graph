cg.Operator = (function () {

    /**
     * This block represents a simple Operator that takes some inputs and returns one or zero output.
     * @extends {cg.Block}
     * @param cgGraph {cg.Graph}
     * @param data {Object}
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
            throw new cg.GraphError("Operator `{0}` should only take 2 inputs", this.cgId);
        }
        if (!data.cgReturn) {
            throw new cg.GraphError("Operator `{0}` should return a value", this.cgId);
        }
    });

    return Operator;

})();