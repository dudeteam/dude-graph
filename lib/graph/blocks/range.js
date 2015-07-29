cg.Range = (function () {

    /**
     *
     * @extends {cg.Block}
     * @param cgGraph {cg.Graph}
     * @param data {Object}
     * @constructor
     */
    var Range = pandora.class_("Range", cg.Block, function (cgGraph, data) {
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
                    "cgName": "start",
                    "cgValueType": "Number"
                },
                {
                    "cgType": "Point",
                    "cgName": "end",
                    "cgValueType": "Number"
                },
                {
                    "cgType": "Point",
                    "cgName": "delta",
                    "cgValueType": "Number"
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

    return Range;

})();