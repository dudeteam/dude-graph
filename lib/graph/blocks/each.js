//
// Copyright (c) 2015 DudeTeam. All rights reserved.
//

/**
 * @extends {dudeGraph.Block}
 * @param {dudeGraph.Graph} cgGraph
 * @param {Object} data
 * @constructor
 */
dudeGraph.Each = function (cgGraph, data) {
    dudeGraph.Block.call(this, cgGraph, data, "Each");
};

/**
 * @extends {dudeGraph.Block}
 */
dudeGraph.Each.prototype = _.create(dudeGraph.Block.prototype, {
    "constructor": dudeGraph.Each
});