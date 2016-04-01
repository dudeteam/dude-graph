/**
 * Condition represents a conditional branch, similar to `if`
 * @param {dudeGraph.Block.blockDataTypedef} [blockData={}]
 * @class
 * @extends {dudeGraph.Block}
 */
dudeGraph.ConditionBlock = function (blockData) {
    dudeGraph.Block.call(this, blockData);
};

dudeGraph.ConditionBlock.prototype = _.create(dudeGraph.Block.prototype, {
    "constructor": dudeGraph.ConditionBlock,
    "className": "ConditionBlock"
});

/**
 * Called when the basic points are created
 * @override
 */
dudeGraph.ConditionBlock.prototype.validatePoints = function () {
    dudeGraph.Block.prototype.validatePoints.call(this);
    if (!(this.inputByName("in") instanceof dudeGraph.StreamPoint)) {
        throw new Error("ConditionBlock `" + this.blockFancyName + "` must have an input `in` of type `Stream`");
    }
    if (!(this.inputByName("test") instanceof dudeGraph.Point) || this.inputByName("test").pointValueType !== "Boolean") {
        throw new Error("ConditionBlock `" + this.blockFancyName + "` must have an input `test` of type `Point` of pointValueType `Boolean`");
    }
    if (!(this.outputByName("true") instanceof dudeGraph.StreamPoint)) {
        throw new Error("ConditionBlock `" + this.blockFancyName + "` must have an output `true` of type `Stream`");
    }
    if (!(this.outputByName("false") instanceof dudeGraph.StreamPoint)) {
        throw new Error("ConditionBlock `" + this.blockFancyName + "` must have an output `false` of type `Stream`");
    }
};