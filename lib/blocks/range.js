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
dudeGraph.Range = function (cgGraph, data) {
    dudeGraph.Block.call(this, cgGraph, data, "Range");
};

/**
 * @extends {dudeGraph.Block}
 */
dudeGraph.Range.prototype = _.create(dudeGraph.Block.prototype, {
    "constructor": dudeGraph.Range
});

/**
 * Range factory
 * @param {dudeGraph.Graph} cgGraph
 * @param {Object} data
 */
dudeGraph.Range.buildBlock = function (cgGraph, data) {
    return new dudeGraph.Range(cgGraph, _.merge(data, {
        "cgInputs": [
            {
                "cgName": "in",
                "cgType": "Stream"
            },
            {
                "cgType": "Point",
                "cgName": "start",
                "cgValueType": "Number"
            },
            {
                "cgType": "Point",
                "cgName": "end",
                "cgValueType": "Number"
            },
            {
                "cgType": "Point",
                "cgName": "delta",
                "cgValueType": "Number"
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