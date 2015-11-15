//
// Copyright (c) 2015 DudeTeam. All rights reserved.
//

/**
 * This block represents a simple function that takes some inputs and returns one or zero output.
 * @param {dudeGraph.Graph} cgGraph
 * @param {Object} data
 * @class
 * @extends {dudeGraph.Block}
 */
dudeGraph.Function = function (cgGraph, data) {
    dudeGraph.Block.call(this, cgGraph, data, "Function");
};

dudeGraph.Function.prototype = _.create(dudeGraph.Block.prototype, {
    "constructor": dudeGraph.Function
});