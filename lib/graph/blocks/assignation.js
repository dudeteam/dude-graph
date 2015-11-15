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
dudeGraph.Assignation = function (cgGraph, data) {
    dudeGraph.Block.call(this, cgGraph, data, "Assignation");
};

dudeGraph.Assignation.prototype = _.create(dudeGraph.Block.prototype, {
    "constructor": dudeGraph.Assignation
});

/**
 * Validates the block content
 * Called when the graph adds this block
 */
dudeGraph.Assignation.prototype.validate = function () {
    if (!(this.inputByName("in") instanceof dudeGraph.Stream)) {
        throw new Error("Assignation `" + this.cgId + "` must have an input `in` of type `Stream`");
    }
    if (!(this.inputByName("this") instanceof dudeGraph.Point)) {
        throw new Error("Assignation `" + this.cgId + "` must have an input `this` of type `Point`");
    }
    if (!(this.inputByName("other") instanceof dudeGraph.Point)) {
        throw new Error("Assignation `" + this.cgId + "` must have an input `other` of type `Point`");
    }
    if (this.inputByName("this")._cgValueType !== this.inputByName("other")._cgValueType) {
        throw new Error("Assignation `" + this.cgId + "` inputs `this` and `other` must have the same cgValueType");
    }
    if (!(this.outputByName("out") instanceof dudeGraph.Stream)) {
        throw new Error("Assignation `" + this.cgId + "` must have an output `out` of type `Stream`");
    }
};