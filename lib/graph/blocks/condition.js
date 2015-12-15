//
// Copyright (c) 2015 DudeTeam. All rights reserved.
//

/**
 * @param {dudeGraph.Graph} cgGraph
 * @param {Object} data
 * @class
 * @extends {dudeGraph.Block}
 */
dudeGraph.Condition = function (cgGraph, data) {
    dudeGraph.Block.call(this, cgGraph, data);
};

dudeGraph.Condition.prototype = _.create(dudeGraph.Block.prototype, {
    "constructor": dudeGraph.Condition,
    "className": "Condition"
});

/**
 * Validates the block content
 * Called when the graph adds this block
 */
dudeGraph.Condition.prototype.validate = function () {
    if (!(this.inputByName("in") instanceof dudeGraph.Stream)) {
        throw new Error("Condition `" + this.cgId + "` must have an input `in` of type `Stream`");
    }
    if (!(this.inputByName("test") instanceof dudeGraph.Point) || this.inputByName("test").cgValueType !== "Boolean") {
        throw new Error("Condition `" + this.cgId + "` must have an input `test` of type `Point` of cgValueType `Boolean`");
    }
    if (!(this.outputByName("true") instanceof dudeGraph.Stream)) {
        throw new Error("Condition `" + this.cgId + "` must have an output `true` of type `Stream`");
    }
    if (!(this.outputByName("false") instanceof dudeGraph.Stream)) {
        throw new Error("Condition `" + this.cgId + "` must have an output `false` of type `Stream`");
    }
};