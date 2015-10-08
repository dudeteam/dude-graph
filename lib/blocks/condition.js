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
dudeGraph.Condition = function (cgGraph, data) {
    dudeGraph.Block.call(this, cgGraph, data, "Condition");
    if (!(this.inputByName("in") instanceof dudeGraph.Stream)) {
        throw new Error("Condition `" + this.cgId + "` must have an input `in` of type `Stream`");
    }
    if (!(this.inputByName("test") instanceof dudeGraph.Point) || this.inputByName("test").cgValueType !== "Boolean") {
        throw new Error("Condition `" + this.cgId + "` must have an input `test` of type `Point` of cgValueType `Boolean`");
    }
    if (!(this.outputByName("true") instanceof dudeGraph.Stream)) {
        throw new Error("Condition `" + this.cgId + "` must have an output `true` of type `Stream`");
    }
    if (!(this.outputByName("false") instanceof dudeGraph.Stream)) {
        throw new Error("Condition `" + this.cgId + "` must have an output `false` of type `Stream`");
    }
};

/**
 * @extends {dudeGraph.Block}
 */
dudeGraph.Condition.prototype = _.create(dudeGraph.Block.prototype, {
    "constructor": dudeGraph.Condition
});
/**
 * Condition factory
 * @param {dudeGraph.Graph} cgGraph
 * @param {Object} data
 */
dudeGraph.Condition.buildBlock = function (cgGraph, data) {
    return new Condition(cgGraph, _.merge(data, {
        "cgInputs": [
            {
                "cgName": "in",
                "cgType": "Stream"
            },
            {
                "cgType": "Point",
                "cgName": "test",
                "cgValueType": "Boolean"
            }
        ],
        "cgOutputs": [
            {
                "cgName": "true",
                "cgType": "Stream"
            },
            {
                "cgName": "false",
                "cgType": "Stream"
            }
        ]
    }, dudeGraph.ArrayMerger));
};
