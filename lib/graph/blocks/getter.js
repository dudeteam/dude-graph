cg.Getter = (function () {

    /**
     * This block represents a simple Getter that takes some inputs and returns one or zero output.
     * @extends {cg.Block}
     * @param {cg.Graph} cgGraph
     * @param {Object} data
     * @constructor
     */
    var Getter = pandora.class_("Getter", cg.Block, function (cgGraph, data) {
        if (data.cgClassType === undefined) {
            throw new cg.GraphError("Getter `{0}` should specify a class type", data.cgId);
        }
        if (data.cgValueType === undefined) {
            throw new cg.GraphError("Getter `{0}` should specify a value type", data.cgId);
        }
        cg.Block.call(this, cgGraph, {
            cgId: data.cgId,
            cgName: data.cgName,
            cgModel: data.cgModel,
            cgInputs: [{
                cgType: "Point",
                cgName: "this",
                cgValueType: data.cgClassType
            }],
            cgOutputs: [{
                cgType: "Point",
                cgName: "value",
                cgValueType: data.cgValueType
            }]
        });
    });

    return Getter;

})();