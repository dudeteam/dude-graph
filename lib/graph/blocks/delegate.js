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
dudeGraph.Delegate = function (blockData) {
    dudeGraph.Block.call(this, blockData);
};

dudeGraph.Delegate.prototype = _.create(dudeGraph.Block.prototype, {
    "constructor": dudeGraph.Delegate,
    "className": "Delegate"
});

/**
 * Called when the basic points are created
 * @override
 */
dudeGraph.Delegate.prototype.validatePoints = function () {
    if (!(this.outputByName("out") instanceof dudeGraph.Stream)) {
        throw new Error("Delegate `" + this.blockFancyName + "` must have an output `out` of type `Stream`");
    }
};