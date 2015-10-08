//
// Copyright (c) 2015 DudeTeam. All rights reserved.
//

/**
 *
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
/**
 * Each factory
 * @param {dudeGraph.Graph} cgGraph
 * @param {Object} data
 */
dudeGraph.Each.buildBlock = function (cgGraph, data) {
    return new Each(cgGraph, _.merge(data, {
        "cgInputs": [
            {
                "cgName": "in",
                "cgType": "Stream"
            },
            {
                "cgType": "Point",
                "cgName": "list",
                "cgValueType": "List"
            }
        ],
        "cgOutputs": [
            {
                "cgName": "current",
                "cgType": "Stream"
            },
            {
                "cgType": "Point",
                "cgName": "index",
                "cgValueType": "Number"
            },
            {
                "cgName": "completed",
                "cgType": "Stream"
            }
        ]
    }, dudeGraph.ArrayMerger));
};
