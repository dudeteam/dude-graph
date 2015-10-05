cg.Instruction = (function () {

    /**
     * This is like function however, it takes a stream in input and output. In code it would represent function
     * separated by semicolons.
     * @extends {cg.Block}
     * @param {cg.Graph} cgGraph
     * @param {Object} data
     * @constructor
     */
    var Instruction = pandora.class_("Instruction", cg.Block, function (cgGraph, data) {
        cg.Block.call(this, cgGraph, data);
    });

    /**
     * Instruction factory
     * @param {cg.Graph} cgGraph
     * @param {Object} data
     */
    Instruction.buildBlock = function (cgGraph, data) {
        return new Instruction(cgGraph, _.merge(data, {
            "cgInputs": [{
                "cgName": "in",
                "cgType": "Stream"
            }],
            "cgOutputs": data.cgReturn ? [
                {
                    "cgName": "out",
                    "cgType": "Stream"
                },
                {
                    "cgType": "Point",
                    "cgName": "value",
                    "cgValueType": data.cgReturn.cgValueType,
                    "cgTemplate": data.cgReturn.cgTemplate
                }] : [
                {
                    "cgName": "out",
                    "cgType": "Stream"
                }
            ]
        }, cg.ArrayMerger));
    };

    return Instruction;

})();