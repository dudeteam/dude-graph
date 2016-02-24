//
// Copyright (c) 2015 DudeTeam. All rights reserved.
//

/**
 * @param {dudeGraph.Block.blockDataTypedef} [blockData={}]
 * @class
 * @extends {dudeGraph.Block}
 */
dudeGraph.Each = function (blockData) {
    dudeGraph.Block.call(this, blockData);
};

dudeGraph.Each.prototype = _.create(dudeGraph.Block.prototype, {
    "constructor": dudeGraph.Each,
    "className": "Each"
});