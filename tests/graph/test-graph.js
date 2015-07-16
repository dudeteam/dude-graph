var assert = require("assert");
var pandora = require('../../bower_components/pandora/lib/pandora');
var cg = require("../../codegraph");

var blocks = [
    {
        "cgType": "Function",
        "cgId": "0",
        "cgInputs": [
            {
                "cgName": "in",
                "cgValueType": "Number"
            }
        ]
    },
    {
        "cgType": "Function",
        "cgId": "1",
        "cgOutputs": [
            {
                "cgType": "Point", // Will be used by default if not found
                "cgName": "out",
                "cgValue": 64,
                "cgValueType": "Number" // Will be deduced by default from value if possible
            }
        ]
    }
];

var connections = [
    {"cgOutputBlockId": "1", "cgOutputName": "out", "cgInputBlockId": "0",  "cgInputName": "in"}
];

describe("Graph", function () {
    it("should create a new graph with default blocks", function () {
        var graph = new cg.Graph();
        var loader = new cg.JSONLoader();

        loader.load(graph, blocks, connections);
        assert.equal(graph.cgBlocks.length, 2);
    });
});