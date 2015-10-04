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
        if (data.cgInputs) {
            throw new cg.GraphError("Delegate `{0}` shouldn't specify inputs", data.cgId);
        }
        data.cgOutputs = data.cgOutputs || [];
        data.cgOutputs.unshift({
            "cgName": "out",
            "cgType": "Stream"
        });
        cg.Block.call(this, cgGraph, data);
    });

    return Delegate;

})();