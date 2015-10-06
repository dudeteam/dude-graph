dudeGraph.JSONSaver = (function() {

    /**
     * This saves the data of the renderer and the graph.
     * @constructor
     */
    var JSONSaver = pandora.class_("JSONSaver", pandora.EventEmitter, function () {
        pandora.EventEmitter.call(this);
    });

    JSONSaver.prototype.save = function (cgRenderer, cgGraph) {
        return {
            "rendererData": new dudeGraph.RendererSaver().save(cgRenderer),
            "graphData": new dudeGraph.GraphSaver().save(cgGraph)
        };
    };

    return JSONSaver;

})();