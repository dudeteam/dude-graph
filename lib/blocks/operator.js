//
// Copyright (c) 2015 DudeTeam. All rights reserved.
//

/**
 * This block represents a simple Operator that takes some inputs and returns one or zero output.
 * @extends {dudeGraph.Block}
 * @param {dudeGraph.Graph} cgGraph
 * @param {Object} data
 * @constructor
 */
dudeGraph.Operator = function (cgGraph, data) {
    dudeGraph.Block.call(this, cgGraph, data, "Operator");
    if (this.cgInputs.length !== 2) {
        throw new Error("Operator `" + this.cgId + "` must only take 2 inputs");
    }
    if (this.cgOutputs.length !== 1) {
        throw new Error("Operator `" + this.cgId + "` must return one value");
    }
};

/**
 * @extends {dudeGraph.Block}
 */
dudeGraph.Operator.prototype = _.create(dudeGraph.Block.prototype, {
    "constructor": dudeGraph.Operator
});
/**
 * Operator factory
 * @param {dudeGraph.Graph} cgGraph
 * @param {Object} data
 */
dudeGraph.Operator.buildBlock = function (cgGraph, data) {
    return new dudeGraph.Operator(cgGraph, _.merge(data, {
        "cgOutputs": data.cgReturn ? [{
            cgType: "Point",
            cgName: "value",
            cgValueType: data.cgReturn.cgValueType,
            cgTemplate: data.cgReturn.cgTemplate
        }] : null
    }, dudeGraph.ArrayMerger));
};
