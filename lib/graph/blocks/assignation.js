//
// Copyright (c) 2015 DudeTeam. All rights reserved.
//

/**
 * This is like function however, it takes a stream in input and output.
 * In code it would represent function separated by semicolons.
 * @param {dudeGraph.Block.blockData} [blockData={}]
 * @class
 * @extends {dudeGraph.Block}
 */
dudeGraph.Assignation = function (blockData) {
    dudeGraph.Block.call(this, blockData);
};

dudeGraph.Assignation.prototype = _.create(dudeGraph.Block.prototype, {
    "constructor": dudeGraph.Assignation,
    "className": "Assignation"
});

/**
 * Called when the basic points are created
 * @override
 */
dudeGraph.Assignation.prototype.validatePoints = function () {
    if (!(this.inputByName("in") instanceof dudeGraph.Stream)) {
        throw new Error("Assignation `" + this.blockFancyName + "` must have an input `in` of type `Stream`");
    }
    if (!(this.inputByName("this") instanceof dudeGraph.Point)) {
        throw new Error("Assignation `" + this.blockFancyName + "` must have an input `this` of type `Point`");
    }
    if (!(this.inputByName("other") instanceof dudeGraph.Point)) {
        throw new Error("Assignation `" + this.blockFancyName + "` must have an input `other` of type `Point`");
    }
    if (this.inputByName("this").pointValueType !== this.inputByName("other").pointValueType) {
        throw new Error("Assignation `" + this.blockFancyName + "` inputs `this` and `other` must have the same pointValueType");
    }
    if (!(this.outputByName("out") instanceof dudeGraph.Stream)) {
        throw new Error("Assignation `" + this.blockFancyName + "` must have an output `out` of type `Stream`");
    }
};