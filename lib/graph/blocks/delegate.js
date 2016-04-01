/**
 * This is like function however, it takes a stream in input and output.
 * In code it would represent function separated by semicolons.
 * @param {dudeGraph.Block.blockDataTypedef} [blockData={}]
 * @class
 * @extends {dudeGraph.Block}
 */
dudeGraph.DelegateBlock = function (blockData) {
    dudeGraph.Block.call(this, blockData);
};

dudeGraph.DelegateBlock.prototype = _.create(dudeGraph.Block.prototype, {
    "constructor": dudeGraph.DelegateBlock,
    "className": "DelegateBlock"
});

/**
 * Called when the basic points are created
 * @override
 */
dudeGraph.DelegateBlock.prototype.validatePoints = function () {
    dudeGraph.Block.prototype.validatePoints.call(this);
    if (!(this.outputByName("out") instanceof dudeGraph.StreamPoint)) {
        throw new Error("DelegateBlock `" + this.blockFancyName + "` must have an output `out` of type `Stream`");
    }
};