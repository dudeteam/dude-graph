//
// Copyright (c) 2015 DudeTeam. All rights reserved.
//

/**
 * This is like function however, it takes a stream in input and output. In code it would represent function
 * separated by semicolons.
 * @extends {dudeGraph.Block}
 * @param {dudeGraph.Graph} cgGraph
 * @param {Object} data
 * @constructor
 */
dudeGraph.Delegate = function (cgGraph, data) {
    dudeGraph.Block.call(this, cgGraph, data, "Delegate");
    if (!(this.outputByName("out") instanceof dudeGraph.Stream)) {
        throw new Error("Delegate `" + this.cgId + "` must have an output `out` of type `Stream`");
    }
};

/**
 * @extends {dudeGraph.Block}
 */
dudeGraph.Delegate.prototype = _.create(dudeGraph.Block.prototype, {
    "constructor": dudeGraph.Delegate
});
/**
 * Delegate factory
 * @param {dudeGraph.Graph} cgGraph
 * @param {Object} data
 */
dudeGraph.Delegate.buildBlock = function (cgGraph, data) {
    return new Delegate(cgGraph, _.merge(data, {
        "cgOutputs": [
            {
                "cgName": "out",
                "cgType": "Stream"
            }
        ]
    }, dudeGraph.ArrayMerger));
};
