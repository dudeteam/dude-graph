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
        data.cgInputs.unshift({
            "cgName": "in",
            "cgType": "Stream"
        });
        data.cgOutputs = [
            {
                "cgName": "out",
                "cgType": "Stream"
            }
        ];
        if (data.cgReturn) {
            data.cgOutputs.push({
                "cgType": "Point",
                "cgName": "value",
                "cgValueType": data.cgReturn.cgValueType,
                "cgTemplate": data.cgReturn.cgTemplate
            });
        }
        cg.Block.call(this, cgGraph, data);
    });

    return Instruction;

})();