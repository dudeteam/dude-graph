//
// Copyright (c) 2015 DudeTeam. All rights reserved.
//

/**
 * This block represents a simple Getter that takes some inputs and returns one or zero output.
 * @param {dudeGraph.Graph} cgGraph
 * @param {Object} data
 * @class
 * @extends {dudeGraph.Block}
 */
dudeGraph.Getter = function (cgGraph, data) {
    dudeGraph.Block.call(this, cgGraph, data);
};

dudeGraph.Getter.prototype = _.create(dudeGraph.Block.prototype, {
    "constructor": dudeGraph.Getter,
    "className": "Getter"
});