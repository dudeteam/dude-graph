//
// Copyright (c) 2015 DudeTeam. All rights reserved.
//

/**
 * This specific point represent a stream. In other words, it's an abstract way to order instruction blocks into
 * the graph. This type doesn't transform data but represents the execution stream. That's why it can't hold a value
 * or have a specific value type.
 * @param {dudeGraph.Block} cgBlock - Reference to the related cgBlock.
 * @param {Object} data - JSON representation of this stream point
 * @param {Boolean} isOutput - Defined whether this point is an output or an input
 * @class
 * @extends {dudeGraph.Point}
 */
dudeGraph.Stream = function (cgBlock, data, isOutput) {
    dudeGraph.Point.call(this, cgBlock, _.merge(data, {
        "cgName": data.cgName,
        "cgValueType": "Stream"
    }), isOutput, "Stream");
    Object.defineProperty(this, "cgValue", {
        get: function () {
            throw new Error("Stream has no `cgValue`.");
        }.bind(this),
        set: function () {
            throw new Error("Stream has no `cgValue`.");
        }.bind(this)
    });
};

dudeGraph.Stream.prototype = _.create(dudeGraph.Point.prototype, {
    "constructor": dudeGraph.Stream,
    "className": "Stream"
});