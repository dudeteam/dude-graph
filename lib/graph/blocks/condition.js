/**
 * Condition represents a conditional branch, similar to `if`
 * @param {dudeGraph.Block.blockDataTypedef} [blockData={}]
 * @class
 * @extends {dudeGraph.Block}
 */
dudeGraph.Condition = function (blockData) {
    dudeGraph.Block.call(this, blockData);
};

dudeGraph.Condition.prototype = _.create(dudeGraph.Block.prototype, {
    "constructor": dudeGraph.Condition,
    "className": "Condition"
});

/**
 * Called when the basic points are created
 * @override
 */
dudeGraph.Condition.prototype.validatePoints = function () {
    if (!(this.inputByName("in") instanceof dudeGraph.Stream)) {
        throw new Error("Condition `" + this.blockFancyName + "` must have an input `in` of type `Stream`");
    }
    if (!(this.inputByName("test") instanceof dudeGraph.Point) || this.inputByName("test").pointValueType !== "Boolean") {
        throw new Error("Condition `" + this.blockFancyName + "` must have an input `test` of type `Point` of pointValueType `Boolean`");
    }
    if (!(this.outputByName("true") instanceof dudeGraph.Stream)) {
        throw new Error("Condition `" + this.blockFancyName + "` must have an output `true` of type `Stream`");
    }
    if (!(this.outputByName("false") instanceof dudeGraph.Stream)) {
        throw new Error("Condition `" + this.blockFancyName + "` must have an output `false` of type `Stream`");
    }
};