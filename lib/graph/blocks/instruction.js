/**
 * This is like function however, it takes a stream in input and output. In code it would represent function
 * separated by semicolons.
 * @param {dudeGraph.Block.blockDataTypedef} [blockData={}]
 * @class
 * @extends {dudeGraph.Block}
 */
dudeGraph.InstructionBlock = function (blockData) {
    dudeGraph.Block.call(this, blockData);
};

dudeGraph.InstructionBlock.prototype = _.create(dudeGraph.Block.prototype, {
    "constructor": dudeGraph.InstructionBlock,
    "className": "InstructionBlock"
});

/**
 * Called when the basic points are created
 * @override
 */
dudeGraph.InstructionBlock.prototype.validatePoints = function () {
    if (!(this.inputByName("in") instanceof dudeGraph.StreamPoint)) {
        throw new Error("InstructionBlock `" + this.blockFancyName + "` must have an input `in` of type `Stream`");
    }
    if (!(this.outputByName("out") instanceof dudeGraph.StreamPoint)) {
        throw new Error("InstructionBlock `" + this.blockFancyName + "` must have an output `out` of type `Stream`");
    }
};