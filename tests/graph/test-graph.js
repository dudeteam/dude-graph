var assert = require("chai").assert;
var expect = require("chai").expect;
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
        var blockCreateEmit = 0;
        var pointCreateEmit = 0;
        graph.on("cg-block-create", function () {
            ++blockCreateEmit;
        });
        graph.on("cg-point-create", function () {
            ++pointCreateEmit;
        });
        loader.load(graph, blocks, connections);
        assert.equal(graph.cgBlocks.length, 2);
        assert.equal(graph.cgBlocks.length, blockCreateEmit);
        assert.equal(pointCreateEmit, 2);
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
    it("should test block copy", function () {
        var graph = new cg.Graph();
        var loader = new cg.JSONLoader();
        loader.load(graph, blocks, connections);
        var blockWithInput = graph.blockById("0");
        blockWithInput.cgName = "My custom name";
        var blockWithInputClone = blockWithInput.clone(graph);
        assert.equal(blockWithInput.cgName, blockWithInputClone.cgName);
        assert.equal(blockWithInput.cgOutputs.length, blockWithInputClone.cgOutputs.length);
        assert.equal(blockWithInput.cgInputs.length, blockWithInputClone.cgInputs.length);
        assert.equal(
            blockWithInput.inputByName("in").cgConnections[0].cgOutputPoint,
            graph.blockById("1").outputByName("out")
        );
        assert.equal(
            blockWithInput.inputByName("in").cgConnections[0].cgOutputPoint,
            blockWithInputClone.inputByName("in").cgConnections[0].cgOutputPoint
        );
    });
    it("should test some basic error", function () {
        var graph = new cg.Graph();
        var loader = new cg.JSONLoader();
        expect(loader.load.bind(loader, graph, [
            {"": ""}
        ])).to.throw(/`cgId` is required/); // cgId is required
        expect(loader.load.bind(loader, graph, [
            {"cgId": "1"},
            {"cgId": "1"}
        ])).to.throw(/id \d already exists/); // cgId is not unique
        expect(loader.load.bind(loader, graph, [
            {
                "cgId": "2",
                "cgOutputs": [
                    {"": ""}
                ]
            }
        ])).to.throw(); // cgName is missing in output definition
        expect(loader.load.bind(loader, graph, [
            {
                "cgId": "3",
                "cgOutputs": [
                    {"cgName": "hello"}
                ]
            }
        ])).to.throw(/(cgValue|cgValueType)/); // cgValue or cgValueType is missing in output definition
        expect(loader.load.bind(loader, graph, [
            {
                "cgId": "4",
                "cgOutputs": [
                    {
                        "cgName": "hello",
                        "cgValueType": "Number"
                    }
                ]
            },
            {
                "cgId": "5",
                "cgInputs": [
                    {
                        "cgName": "hello",
                        "cgValueType": "Number"
                    }
                ]
            },
            {
                "cgId": "6",
                "cgInputs": [
                    {
                        "cgName": "hello",
                        "cgValueType": "Number"
                    }
                ]
            }
        ], [
            {"cgOutputBlockId": "4", "cgOutputName": "hello", "cgInputBlockId": "5", "cgInputName": "hello"},
            {"cgOutputBlockId": "4", "cgOutputName": "hello", "cgInputBlockId": "6", "cgInputName": "hello"}
        ])).to.throw(/Cannot accept more than \d connections/); // Too many connections on one output point
    });
});