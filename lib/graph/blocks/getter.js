//
// Copyright (c) 2015 DudeTeam. All rights reserved.
//

/**
 * This block represents a simple Getter that takes some inputs and returns one or zero output.
 * @param {dudeGraph.Block.blockData} [blockData={}]
 * @class
 * @extends {dudeGraph.Block}
 */
dudeGraph.Getter = function (blockData) {
    dudeGraph.Block.call(this, blockData);
};

dudeGraph.Getter.prototype = _.create(dudeGraph.Block.prototype, {
    "constructor": dudeGraph.Getter,
    "className": "Getter"
});