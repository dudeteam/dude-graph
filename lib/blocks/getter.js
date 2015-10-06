dudeGraph.Getter = (function () {

    /**
     * This block represents a simple Getter that takes some inputs and returns one or zero output.
     * @extends {dudeGraph.Block}
     * @param {dudeGraph.Graph} cgGraph
     * @param {Object} data
     * @constructor
     */
    var Getter = pandora.class_("Getter", dudeGraph.Block, function (cgGraph, data) {
        if (data.cgClassType === undefined) {
            throw new Error("Getter `" + data.cgId + "` should specify a class type");
        }
        if (data.cgValueType === undefined) {
            throw new Error("Getter `" + data.cgId + "` should specify a value type");
        }
        dudeGraph.Block.call(this, cgGraph, data);
    });

    /**
     * Getter factory
     * @param {dudeGraph.Graph} cgGraph
     * @param {Object} data
     */
    Getter.buildBlock = function (cgGraph, data) {
        return new Getter(cgGraph, _.merge(data, {
            "cgInputs": [{
                "cgType": "Point",
                "cgName": "this",
                "cgValueType": data.cgClassType
            }],
            "cgOutputs": [{
                "cgType": "Point",
                "cgName": "value",
                "cgValueType": data.cgValueType
            }]
        }, dudeGraph.ArrayMerger));
    };

    return Getter;

})();