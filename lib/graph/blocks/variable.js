/**
 * @param {dudeGraph.Block.blockDataTypedef} [blockData={}]
 * @class
 * @extends {dudeGraph.Block}
 */
dudeGraph.VariableBlock = function (blockData) {
    dudeGraph.Block.call(this, blockData);
};

dudeGraph.VariableBlock.prototype = _.create(dudeGraph.Block.prototype, {
    "constructor": dudeGraph.VariableBlock,
    "className": "VariableBlock"
});

/**
 * Called when the basic points are created
 * @override
 */
dudeGraph.VariableBlock.prototype.validatePoints = function () {
    if (!(this.outputByName("value") instanceof dudeGraph.Point)) {
        throw new Error("VariableBlock `" + this.blockFancyName + "` must have an output `value` of type `Point`");
    }
};