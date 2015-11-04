//
// Copyright (c) 2015 DudeTeam. All rights reserved.
//

/**
 * @extends {dudeGraph.Block}
 * @param {dudeGraph.Graph} cgGraph
 * @param {Object} data
 * @constructor
 */
dudeGraph.Range = function (cgGraph, data) {
    dudeGraph.Block.call(this, cgGraph, data, "Range");
};

/**
 * @extends {dudeGraph.Block}
 */
dudeGraph.Range.prototype = _.create(dudeGraph.Block.prototype, {
    "constructor": dudeGraph.Range
});