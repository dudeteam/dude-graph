cg.Function = (function () {

    /**
     * This block represents a simple function that takes some inputs and returns one or zero output.
     * @extends {cg.Block}
     * @param {cg.Graph} cgGraph
     * @param {Object} data
     * @constructor
     */
    var FunctionImpl = pandora.class_("Function", cg.Block, function (cgGraph, data) {
        cg.Block.call(this, cgGraph, {
            cgId: data.cgId,
            cgName: data.cgName,
            cgModel: data.cgModel,
            cgTemplates: data.cgTemplates,
            cgInputs: data.cgInputs,
            cgOutputs: data.cgReturn ? [{
                cgType: "Point",
                cgName: "value",
                cgValueType: data.cgReturn.cgValueType,
                cgTemplate: data.cgReturn.cgTemplate
            }] : null
        });
    });

    /**
     * Function factory
     * @param {cg.Graph} cgGraph
     * @param {Object} data
     */
    FunctionImpl.buildBlock = function (cgGraph, data) {
        return new FunctionImpl(cgGraph, data);
    };

    return FunctionImpl;

})();