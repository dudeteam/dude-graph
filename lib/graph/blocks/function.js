cg.Function = (function() {

    /**
     *
     * @extends {cg.Block}
     * @param cgGraph {cg.Graph}
     * @param cgId {String}
     * @constructor
     */
    var Function = pandora.class_("Function", cg.Block, function(cgGraph, cgId) {
        cg.Block.call(this, cgGraph, cgId);
    });

    return Function;

})();