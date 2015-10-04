cg.Each = (function () {

    /**
     *
     * @extends {cg.Block}
     * @param {cg.Graph} cgGraph
     * @param {Object} data
     * @constructor
     */
    var Each = pandora.class_("Each", cg.Block, function (cgGraph, data) {
        cg.Block.call(this, cgGraph, {
            cgId: data.cgId,
            cgName: data.cgName,
            cgInputs: [
                {
                    "cgName": "in",
                    "cgType": "Stream"
                },
                {
                    "cgType": "Point",
                    "cgName": "list",
                    "cgValueType": "List"
                }
            ],
            cgOutputs: [
                {
                    "cgName": "current",
                    "cgType": "Stream"
                },
                {
                    "cgType": "Point",
                    "cgName": "index",
                    "cgValueType": "Number"
                },
                {
                    "cgName": "completed",
                    "cgType": "Stream"
                }
            ]
        });
    });

    /**
     * Each factory
     * @param {cg.Graph} cgGraph
     * @param {Object} data
     */
    Each.buildBlock = function (cgGraph, data) {
        return new Each(cgGraph, data);
    };

    return Each;

})();