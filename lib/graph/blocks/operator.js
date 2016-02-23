//
// Copyright (c) 2015 DudeTeam. All rights reserved.
//

/**
 * This block represents a simple Operator that takes some inputs and returns one or zero output.
 * @param {dudeGraph.Block.blockData} [blockData={}]
 * @class
 * @extends {dudeGraph.Block}
 */
dudeGraph.Operator = function (blockData) {
    dudeGraph.Block.call(this, blockData);
};

dudeGraph.Operator.prototype = _.create(dudeGraph.Block.prototype, {
    "constructor": dudeGraph.Operator,
    "className": "Operator"
});

/**
 * Called when the basic points are created
 * @override
 */
dudeGraph.Operator.prototype.validatePoints = function () {
    if (this.cgInputs.length !== 2) {
        throw new Error("Operator `" + this.blockFancyName + "` must only take 2 inputs");
    }
    if (this.cgOutputs.length !== 1) {
        throw new Error("Operator `" + this.blockFancyName + "` must return one value");
    }
};