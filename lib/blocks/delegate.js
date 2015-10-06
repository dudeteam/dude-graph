dudeGraph.Delegate = (function () {

    /**
     * This is like function however, it takes a stream in input and output. In code it would represent function
     * separated by semicolons.
     * @extends {dudeGraph.Block}
     * @param {dudeGraph.Graph} cgGraph
     * @param {Object} data
     * @constructor
     */
    var Delegate = pandora.class_("Delegate", dudeGraph.Block, function (cgGraph, data) {
        if (data.cgInputs) {
            throw new cg.GraphError("Delegate `{0}` shouldn't specify inputs", data.cgId);
        }
        data.cgOutputs = data.cgOutputs || [];
        data.cgOutputs.unshift({
            "cgName": "out",
            "cgType": "Stream"
        });
        dudeGraph.Block.call(this, cgGraph, data, "Delegate");
    });

    /**
     * Delegate factory
     * @param {dudeGraph.Graph} cgGraph
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
        }, dudeGraph.ArrayMerger));
    };

    return Delegate;

})();