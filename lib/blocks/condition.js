dudeGraph.Condition = (function () {

    /**
     *
     * @extends {dudeGraph.Block}
     * @param {dudeGraph.Graph} cgGraph
     * @param {Object} data
     * @constructor
     */
    var Condition = pandora.class_("Condition", dudeGraph.Block, function (cgGraph, data) {
        dudeGraph.Block.call(this, cgGraph, data, "Condition");
    });

    /**
     * Condition factory
     * @param {dudeGraph.Graph} cgGraph
     * @param {Object} data
     */
    Condition.buildBlock = function (cgGraph, data) {
        return new Condition(cgGraph, _.merge(data, {
            "cgInputs": [
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
            "cgOutputs": [
                {
                    "cgName": "true",
                    "cgType": "Stream"
                },
                {
                    "cgName": "false",
                    "cgType": "Stream"
                }
            ]
        }, dudeGraph.ArrayMerger));
    };

    return Condition;

})();