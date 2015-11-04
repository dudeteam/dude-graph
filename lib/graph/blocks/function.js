//
// Copyright (c) 2015 DudeTeam. All rights reserved.
//

/**
 * This block represents a simple function that takes some inputs and returns one or zero output.
 * @extends {dudeGraph.Block}
 * @param {dudeGraph.Graph} cgGraph
 * @param {Object} data
 * @constructor
 */
dudeGraph.Function = function (cgGraph, data) {
    dudeGraph.Block.call(this, cgGraph, data, "Function");
};

/**
 * @extends {dudeGraph.Block}
 */
dudeGraph.Function.prototype = _.create(dudeGraph.Block.prototype, {
    "constructor": dudeGraph.Function
});