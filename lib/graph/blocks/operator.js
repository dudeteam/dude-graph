/**
 * This block represents a simple Operator that takes some inputs and returns one or zero output.
 * @param {dudeGraph.Block.blockDataTypedef} [blockData={}]
 * @class
 * @extends {dudeGraph.Block}
 */
dudeGraph.OperatorBlock = function (blockData) {
    dudeGraph.Block.call(this, blockData);
};

dudeGraph.OperatorBlock.prototype = _.create(dudeGraph.Block.prototype, {
    "constructor": dudeGraph.OperatorBlock,
    "className": "OperatorBlock"
});

/**
 * Called when the basic points are created
 * @override
 */
dudeGraph.OperatorBlock.prototype.validatePoints = function () {
    dudeGraph.Block.prototype.validatePoints.call(this);
    if (this.blockOutputs.length !== 1) {
        throw new Error("OperatorBlock `" + this.blockFancyName + "` must return one value");
    }
    if (this.blockInputs.length !== 2) {
        throw new Error("OperatorBlock `" + this.blockFancyName + "` must only take 2 inputs");
    }
};