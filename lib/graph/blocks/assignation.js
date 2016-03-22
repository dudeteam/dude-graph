/**
 * This is like function however, it takes a stream in input and output.
 * In code it would represent function separated by semicolons.
 * @param {dudeGraph.Block.blockDataTypedef} [blockData={}]
 * @class
 * @extends {dudeGraph.Block}
 */
dudeGraph.AssignationBlock = function (blockData) {
    dudeGraph.Block.call(this, blockData);
};

dudeGraph.AssignationBlock.prototype = _.create(dudeGraph.Block.prototype, {
    "constructor": dudeGraph.AssignationBlock,
    "className": "AssignationBlock"
});

/**
 * Called when the basic points are created
 * @override
 */
dudeGraph.AssignationBlock.prototype.validatePoints = function () {
    if (!(this.inputByName("in") instanceof dudeGraph.StreamPoint)) {
        throw new Error("AssignationBlock `" + this.blockFancyName + "` must have an input `in` of type `Stream`");
    }
    if (!(this.inputByName("variable") instanceof dudeGraph.Point)) {
        throw new Error("AssignationBlock `" + this.blockFancyName + "` must have an input `variable` of type `Point`");
    }
    if (!(this.inputByName("value") instanceof dudeGraph.Point)) {
        throw new Error("AssignationBlock `" + this.blockFancyName + "` must have an input `value` of type `Point`");
    }
    if (this.inputByName("variable").pointValueType !== this.inputByName("value").pointValueType) {
        throw new Error("AssignationBlock `" + this.blockFancyName + "` inputs `variable` and `value` must have the same pointValueType");
    }
    if (!(this.outputByName("out") instanceof dudeGraph.StreamPoint)) {
        throw new Error("AssignationBlock `" + this.blockFancyName + "` must have an output `out` of type `Stream`");
    }
};