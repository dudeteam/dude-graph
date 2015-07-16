cg.Instruction = (function() {

    /**
     *
     * @extends {cg.Block}
     * @param graph {cg.Graph}
     * @param id {number}
     * @constructor
     */
    var Instruction = pandora.class_("Instruction", cg.Block, function(graph, id) {
        cg.Block.call(this, graph, id);
    });

    return Instruction;

})();