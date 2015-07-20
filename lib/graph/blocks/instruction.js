cg.Instruction = (function() {

    /**
     *
     * @extends {cg.Block}
     * @param cgGraph {cg.Graph}
     * @param cgId {String}
     * @constructor
     */
    var Instruction = pandora.class_("Instruction", cg.Block, function(cgGraph, cgId) {
        cg.Block.call(this, cgGraph, cgId);
    });

    return Instruction;

})();