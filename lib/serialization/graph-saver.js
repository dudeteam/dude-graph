//
// Copyright (c) 2015 DudeTeam. All rights reserved.
//

/**
 * Save a graph into JSON
 * @constructor
 */
dudeGraph.GraphSaver = function (config) {
    pandora.EventEmitter.call(this);
    this.config = config;
};

/**
 * @extends {pandora.EventEmitter}
 */
dudeGraph.GraphSaver.prototype = _.create(pandora.EventEmitter.prototype, {
    "constructor": dudeGraph.GraphSaver
});

/**
 * Saves the graph as JSON
 * @param {dudeGraph.Graph} cgGraph
 * @returns {{blocks: Array, connections: Array}}
 */
dudeGraph.GraphSaver.prototype.save = function (cgGraph) {
    return {
        "blocks": _.map(cgGraph.cgBlocks, function (cgBlock) {
            return cgBlock.save();
        }),
        "connections": _.map(cgGraph.cgConnections, function (cgConnection) {
            return cgConnection.save();
        })
    };
};