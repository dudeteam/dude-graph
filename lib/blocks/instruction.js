//
// Copyright (c) 2015 DudeTeam. All rights reserved.
//

/**
 * This is like function however, it takes a stream in input and output. In code it would represent function
 * separated by semicolons.
 * @extends {dudeGraph.Block}
 * @param {dudeGraph.Graph} cgGraph
 * @param {Object} data
 * @constructor
 */
dudeGraph.Instruction =  function (cgGraph, data) {
    dudeGraph.Block.call(this, cgGraph, data, "Instruction");
    if (!(this.inputByName("in") instanceof dudeGraph.Stream)) {
        throw new Error("Instruction `" + this.cgId + "` must have an input `in` of type `Stream`");
    }
    if (!(this.outputByName("out") instanceof dudeGraph.Stream)) {
        throw new Error("Instruction `" + this.cgId + "` must have an output `out` of type `Stream`");
    }
};

/**
 * @extends {dudeGraph.Block}
 */
dudeGraph.Instruction.prototype = _.create(dudeGraph.Block.prototype, {
    "constructor": dudeGraph.Instruction
});
/**
 * Instruction factory
 * @param {dudeGraph.Graph} cgGraph
 * @param {Object} data
 */
dudeGraph.Instruction.buildBlock = function (cgGraph, data) {
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
    }, dudeGraph.ArrayMerger));
};
