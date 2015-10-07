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

_.extend(dudeGraph.JSONSaver, pandora.EventEmitter);

dudeGraph.JSONSaver.prototype.save = function (cgRenderer, cgGraph) {
    return {
        "rendererData": new dudeGraph.RendererSaver().save(cgRenderer),
        "graphData": new dudeGraph.GraphSaver().save(cgGraph)
    };
};
