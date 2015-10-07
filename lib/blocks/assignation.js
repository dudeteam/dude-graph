dudeGraph.Assignation = (function () {

    /**
     * This is like function however, it takes a stream in input and output. In code it would represent function
     * separated by semicolons.
     * @extends {dudeGraph.Block}
     * @param {dudeGraph.Graph} cgGraph
     * @param {Object} data
     * @constructor
     */
    var Assignation = pandora.class_("Assignation", dudeGraph.Block, function (cgGraph, data) {
        dudeGraph.Block.call(this, cgGraph, data, "Assignation");
        if (!(this.inputByName("in") instanceof dudeGraph.Stream)) {
            throw new Error("Assignation `" + this.cgId + "` must have an input `in` of type `Stream`");
        }
        if (!(this.inputByName("this") instanceof dudeGraph.Point)) {
            throw new Error("Assignation `" + this.cgId + "` must have an input `this` of type `Point`");
        }
        if (!(this.inputByName("other") instanceof dudeGraph.Point)) {
            throw new Error("Assignation `" + this.cgId + "` must have an input `other` of type `Point`");
        }
        if (this.inputByName("this")._cgValueType !== this.inputByName("other")._cgValueType) {
            throw new Error("Assignation `" + this.cgId + "` inputs `this` and `other` must have the same cgValueType");
        }
        if (!(this.outputByName("out") instanceof dudeGraph.Stream)) {
            throw new Error("Assignation `" + this.cgId + "` must have an output `out` of type `Stream`");
        }
    });

    /**
     * Assignation factory
     * @param {dudeGraph.Graph} cgGraph
     * @param {Object} data
     */
    Assignation.buildBlock = function (cgGraph, data) {
        return new Assignation(cgGraph, _.merge(data, {
            "cgInputs": [
                {
                    "cgName": "in",
                    "cgType": "Stream"
                },
                {
                    "cgName": "this",
                    "cgType": "Point",
                    "cgValueType": data.cgValueType
                },
                {
                    "cgName": "other",
                    "cgType": "Point",
                    "cgValueType": data.cgValueType
                }
            ],
            "cgOutputs": [
                {
                    "cgName": "out",
                    "cgType": "Stream"
                }
            ]
        }, dudeGraph.ArrayMerger));
    };

    return Assignation;

})();