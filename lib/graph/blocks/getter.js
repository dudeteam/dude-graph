cg.Getter = (function () {

    /**
     * This block represents a simple Getter that takes some inputs and returns one or zero output.
     * @extends {cg.Block}
     * @param cgGraph {cg.Graph}
     * @param data {Object}
     * @constructor
     */
    var Getter = pandora.class_("Getter", cg.Block, function (cgGraph, data) {
        if (data.cgClassType === undefined) {
            throw new cg.GraphError("Getter `{0}` should specify a class type");
        }
        if (data.cgValueType === undefined) {
            throw new cg.GraphError("Getter `{0}` should specify a value type");
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