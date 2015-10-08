//
// Copyright (c) 2015 DudeTeam. All rights reserved.
//

/**
 * This saves the data of the renderer and the graph.
 * @constructor
 */
dudeGraph.JSONSaver = function () {
    pandora.EventEmitter.call(this);
};

/**
 * @extends {pandora.EventEmitter}
 */
dudeGraph.JSONSaver.prototype = _.create(pandora.EventEmitter.prototype, {
    "constructor": dudeGraph.JSONSaver
});

/**
 *
 * @param cgRenderer
 * @param cgGraph
 * @returns {{rendererData, graphData}}
 */
dudeGraph.JSONSaver.prototype.save = function (cgRenderer, cgGraph) {
    return {
        "rendererData": new dudeGraph.RendererSaver().save(cgRenderer),
        "graphData": new dudeGraph.GraphSaver().save(cgGraph)
    };
};
