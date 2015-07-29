cg.Condition = (function () {

    /**
     *
     * @extends {cg.Block}
     * @param cgGraph {cg.Graph}
     * @param data {Object}
     * @constructor
     */
    var Condition = pandora.class_("Condition", cg.Block, function (cgGraph, data) {
        cg.Block.call(this, cgGraph, {
            cgId: data.cgId,
            cgName: data.cgName,
            cgInputs: [
                {
                    "cgType": "Point",
                    "cgName": "in",
                    "cgValueType": "Stream"
                },
                {
                    "cgType": "Point",
                    "cgName": "test",
                    "cgValueType": "Boolean"
                }
            ],
            cgOutputs: [
                {
                    "cgType": "Point",
                    "cgName": "true",
                    "cgValueType": "Stream"
                },
                {
                    "cgType": "Point",
                    "cgName": "false",
                    "cgValueType": "Stream"
                }
            ]
        });
    });

    return Condition;

})();