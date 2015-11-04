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
dudeGraph.Instruction = function (cgGraph, data) {
    dudeGraph.Block.call(this, cgGraph, data, "Instruction");
};

/**
 * @extends {dudeGraph.Block}
 */
dudeGraph.Instruction.prototype = _.create(dudeGraph.Block.prototype, {
    "constructor": dudeGraph.Instruction
});

/**
 * Validates the block content
 * Called when the graph adds this block
 */
dudeGraph.Instruction.prototype.validate = function () {
    if (!(this.inputByName("in") instanceof dudeGraph.Stream)) {
        throw new Error("Instruction `" + this.cgId + "` must have an input `in` of type `Stream`");
    }
    if (!(this.outputByName("out") instanceof dudeGraph.Stream)) {
        throw new Error("Instruction `" + this.cgId + "` must have an output `out` of type `Stream`");
    }
};