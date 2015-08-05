cg.Assignation = (function () {

    /**
     * This is like function however, it takes a stream in input and output. In code it would represent function
     * separated by semicolons.
     * @extends {cg.Block}
     * @param cgGraph {cg.Graph}
     * @param data {Object}
     * @constructor
     */
    var Assignation = pandora.class_("Assignation", cg.Block, function (cgGraph, data) {
        data.cgInputs = [
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
        ];
        data.cgOutputs = [
            {
                "cgName": "out",
                "cgType": "Stream"
            }
        ];
        cg.Block.call(this, cgGraph, data);
    });

    return Assignation;

})();