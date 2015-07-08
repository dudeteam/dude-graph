cg.Function = (function() {

    /**
     *
     * @extends {cg.Block}
     * @param graph {cg.Graph}
     * @param id {number}
     * @constructor
     */
    var Function = pandora.class_("Function", cg.Block, function(graph, id) {
        cg.Block.call(this, graph, id);
    });

    return Function;

})();