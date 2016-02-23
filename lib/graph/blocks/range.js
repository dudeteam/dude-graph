//
// Copyright (c) 2015 DudeTeam. All rights reserved.
//

/**
 * @param {dudeGraph.Block.blockData} [blockData={}]
 * @class
 * @extends {dudeGraph.Block}
 */
dudeGraph.Range = function (blockData) {
    dudeGraph.Block.call(this, blockData);
};

dudeGraph.Range.prototype = _.create(dudeGraph.Block.prototype, {
    "constructor": dudeGraph.Range,
    "className": "Range"
});