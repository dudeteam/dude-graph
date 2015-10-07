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
        if (!(this.inputByName("in") instanceof dudeGraph.Stream)) {
            throw new Error("Condition `" + this.cgId + "` must have an input `in` of type `Stream`");
        }
        if (!(this.inputByName("test") instanceof dudeGraph.Point) || this.inputByName("test").cgValueType !== "Boolean") {
            throw new Error("Condition `" + this.cgId + "` must have an input `test` of type `Point` of cgValueType `Boolean`");
        }
        if (!(this.outputByName("true") instanceof dudeGraph.Stream)) {
            throw new Error("Condition `" + this.cgId + "` must have an output `true` of type `Stream`");
        }
        if (!(this.outputByName("false") instanceof dudeGraph.Stream)) {
            throw new Error("Condition `" + this.cgId + "` must have an output `false` of type `Stream`");
        }
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