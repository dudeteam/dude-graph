/**
 * This is like function however, it takes a stream in input and output. In code it would represent function
 * separated by semicolons.
 * @param {dudeGraph.Block.blockDataTypedef} [blockData={}]
 * @class
 * @extends {dudeGraph.Block}
 */
dudeGraph.Instruction = function (blockData) {
    dudeGraph.Block.call(this, blockData);
};

dudeGraph.Instruction.prototype = _.create(dudeGraph.Block.prototype, {
    "constructor": dudeGraph.Instruction,
    "className": "Instruction"
});

/**
 * Called when the basic points are created
 * @override
 */
dudeGraph.Instruction.prototype.validatePoints = function () {
    if (!(this.inputByName("in") instanceof dudeGraph.Stream)) {
        throw new Error("Instruction `" + this.blockFancyName + "` must have an input `in` of type `Stream`");
    }
    if (!(this.outputByName("out") instanceof dudeGraph.Stream)) {
        throw new Error("Instruction `" + this.blockFancyName + "` must have an output `out` of type `Stream`");
    }
};