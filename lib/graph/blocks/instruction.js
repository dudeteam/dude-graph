cg.Instruction = (function () {

    /**
     * This is like function however, it takes a stream in input and output. In code it would represent function
     * separated by semicolons.
     * @extends {cg.Block}
     * @param cgGraph {cg.Graph}
     * @param data {Object}
     * @constructor
     */
    var Instruction = pandora.class_("Instruction", cg.Block, function (cgGraph, data) {
        cg.Block.call(this, cgGraph, {
            cgId: data.cgId,
            cgName: data.cgName,
            cgModel: data.cgModel,
            cgTemplates: data.cgTemplates,
            cgInputs: [{
                "cgName": "in",
                "cgType": "Stream"
            }].concat(data.cgInputs),
            cgOutputs: data.cgReturn ? [{
                "cgName": "out",
                "cgType": "Stream"
            }, {
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
        });
    });

    return Instruction;

})();