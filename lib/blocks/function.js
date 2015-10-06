dudeGraph.Function = (function () {

    /**
     * This block represents a simple function that takes some inputs and returns one or zero output.
     * @extends {dudeGraph.Block}
     * @param {dudeGraph.Graph} cgGraph
     * @param {Object} data
     * @constructor
     */
    var FunctionImpl = pandora.class_("Function", dudeGraph.Block, function (cgGraph, data) {
        dudeGraph.Block.call(this, cgGraph, data);
    });

    /**
     * Function factory
     * @param {dudeGraph.Graph} cgGraph
     * @param {Object} data
     */
    FunctionImpl.buildBlock = function (cgGraph, data) {
        return new FunctionImpl(cgGraph, _.merge(data, {
            "cgOutputs": data.cgReturn ? [{
                cgType: "Point",
                cgName: "value",
                cgValueType: data.cgReturn.cgValueType,
                cgTemplate: data.cgReturn.cgTemplate
            }] : null
        }, dudeGraph.ArrayMerger));
    };

    return FunctionImpl;

})();