cg.Function = (function () {

    /**
     * This block represents a simple function that takes some inputs and returns one or zero output.
     * @extends {cg.Block}
     * @param cgGraph {cg.Graph}
     * @param data {Object}
     * @constructor
     */
    var Function = pandora.class_("Function", cg.Block, function (cgGraph, data) {
        cg.Block.call(this, cgGraph, {
            cgId: data.cgId,
            cgName: data.cgName,
            cgInputs: data.cgInputs,
            cgOutputs: data.cgReturnType ? [{
                cgType: "Point",
                cgName: "value",
                cgValueType: data.cgReturnType
            }] : null
        });
    });

    return Function;

})();