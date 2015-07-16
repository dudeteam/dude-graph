var assert = require("assert");
var pandora = require('../../bower_components/pandora/lib/pandora');
var cg = require("../../codegraph");

var blocks = [
    {
        "cgId": "0",
        "cgInputs": [
            {
                "cgType": "Point", // Will be used by default if not found
                "cgName": "in",
                "cgValueType": "Number"
            }
        ]
    },
    {
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
    {"cgOutputBlockId": "1", "cgOutputName": "out", "cgInputBlockId": "0", "cgInputName": "in"}
];

describe("Graph", function () {
    it("should deserialize a graph with some blocks and a connection", function () {
        var graph = new cg.Graph();
        var loader = new cg.JSONLoader();

        loader.load(graph, blocks, connections);
        assert.equal(graph.cgBlocks.length, 2);
        assert.equal(graph.cgConnections.length, 1);
        assert.equal(graph.blockById("1").outputByName("out").cgValue, 64);
        assert.equal(graph.blockById("0").inputByName("in").cgValueType, "Number");
        graph.blockById("1").outputByName("out").cgValue = 128;
        assert.equal(graph.blockById("1").outputByName("out").cgValue, 128);
        assert.equal(
            graph.connectionsByPoint(graph.blockById("1").outputByName("out"))[0],
            graph.connectionsByPoint(graph.blockById("0").inputByName("in"))[0]
        );
    });
    it("should test some basic error", function () {
        var graph = new cg.Graph();
        var loader = new cg.JSONLoader();

        try {
            loader.load(graph, [
                {
                    "": ""
                }
            ]); // cgId is required
            assert.fail();
        } catch (exception) {

        }
        try {
            loader.load(graph, [
                {
                    "cgId": "1"
                },
                {
                    "cgId": "1"
                }
            ]); // cgId is not unique
            assert.fail();
        } catch (exception) {

        }
        try {
            loader.load(graph, [
                {
                    "cgId": "2",
                    "cgOutputs": [
                        {
                            "": ""
                        }
                    ]
                }
            ]); // cgName is missing in output definition
            assert.fail();
        } catch (exception) {

        }
        try {
            loader.load(graph, [
                {
                    "cgId": "3",
                    "cgOutputs": [
                        {
                            "cgName": "hello"
                        }
                    ]
                }
            ]); // cgValue or cgValueType is missing in output definition
            assert.fail();
        } catch (exception) {

        }
    });
});