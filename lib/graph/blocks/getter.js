//
// Copyright (c) 2015 DudeTeam. All rights reserved.
//

/**
 * This block represents a simple Getter that takes some inputs and returns one or zero output.
 * @extends {dudeGraph.Block}
 * @param {dudeGraph.Graph} cgGraph
 * @param {Object} data
 * @constructor
 */
dudeGraph.Getter = function (cgGraph, data) {
    dudeGraph.Block.call(this, cgGraph, data, "Getter");
};

/**
 * @extends {dudeGraph.Block}
 */
dudeGraph.Getter.prototype = _.create(dudeGraph.Block.prototype, {
    "constructor": dudeGraph.Getter
});