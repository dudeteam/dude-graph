cg.Condition = (function () {

    /**
     *
     * @extends {cg.Block}
     * @param {cg.Graph} cgGraph
     * @param {Object} data
     * @constructor
     */
    var Condition = pandora.class_("Condition", cg.Block, function (cgGraph, data) {
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
                    "cgName": "test",
                    "cgValueType": "Boolean"
                }
            ],
            cgOutputs: [
                {
                    "cgName": "true",
                    "cgType": "Stream"
                },
                {
                    "cgName": "false",
                    "cgType": "Stream"
                }
            ]
        });
    });

    return Condition;

})();