dudeGraph.Getter = (function () {

    /**
     * This block represents a simple Getter that takes some inputs and returns one or zero output.
     * @extends {dudeGraph.Block}
     * @param {dudeGraph.Graph} cgGraph
     * @param {Object} data
     * @constructor
     */
    var Getter = pandora.class_("Getter", dudeGraph.Block, function (cgGraph, data) {
        dudeGraph.Block.call(this, cgGraph, data, "Getter");
    });

    /**
     * Getter factory
     * @param {dudeGraph.Graph} cgGraph
     * @param {Object} data
     * @param {String} data.cgClassType - The getter class type
     * @param {String} data.cgValueType - The getter property type
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