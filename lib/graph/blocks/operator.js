//
// Copyright (c) 2015 DudeTeam. All rights reserved.
//

/**
 * This block represents a simple Operator that takes some inputs and returns one or zero output.
 * @param {dudeGraph.Graph} cgGraph
 * @param {Object} data
 * @class
 * @extends {dudeGraph.Block}
 */
dudeGraph.Operator = function (cgGraph, data) {
    dudeGraph.Block.call(this, cgGraph, data, "Operator");
};

dudeGraph.Operator.prototype = _.create(dudeGraph.Block.prototype, {
    "constructor": dudeGraph.Operator
});

/**
 * Validates the block content
 * Called when the graph adds this block
 */
dudeGraph.Operator.prototype.validate = function () {
    if (this.cgInputs.length !== 2) {
        throw new Error("Operator `" + this.cgId + "` must only take 2 inputs");
    }
    if (this.cgOutputs.length !== 1) {
        throw new Error("Operator `" + this.cgId + "` must return one value");
    }
};