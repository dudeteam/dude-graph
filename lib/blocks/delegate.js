cg.Delegate = (function () {

    /**
     * This is like function however, it takes a stream in input and output. In code it would represent function
     * separated by semicolons.
     * @extends {cg.Block}
     * @param {cg.Graph} cgGraph
     * @param {Object} data
     * @constructor
     */
    var Delegate = pandora.class_("Delegate", cg.Block, function (cgGraph, data) {
        cg.Block.call(this, cgGraph, data);
    });

    /**
     * Delegate factory
     * @param {cg.Graph} cgGraph
     * @param {Object} data
     */
    Delegate.buildBlock = function (cgGraph, data) {
        return new Delegate(cgGraph, _.merge(data, {
            "cgOutputs": [
                {
                    "cgName": "out",
                    "cgType": "Stream"
                }
            ]
        }, cg.ArrayMerger));
    };

    return Delegate;

})();