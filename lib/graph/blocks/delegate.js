//
// Copyright (c) 2015 DudeTeam. All rights reserved.
//

/**
 * This is like function however, it takes a stream in input and output. In code it would represent function
 * separated by semicolons.
 * @param {dudeGraph.Graph} cgGraph
 * @param {Object} data
 * @class
 * @extends {dudeGraph.Block}
 */
dudeGraph.Delegate = function (cgGraph, data) {
    dudeGraph.Block.call(this, cgGraph, data, "Delegate");
};

dudeGraph.Delegate.prototype = _.create(dudeGraph.Block.prototype, {
    "constructor": dudeGraph.Delegate
});

/**
 * Validates the block content
 * Called when the graph adds this block
 */
dudeGraph.Delegate.prototype.validate = function () {
    if (!(this.outputByName("out") instanceof dudeGraph.Stream)) {
        throw new Error("Delegate `" + this.cgId + "` must have an output `out` of type `Stream`");
    }
};