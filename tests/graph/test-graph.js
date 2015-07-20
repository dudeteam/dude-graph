var expect = require("chai").expect;
var pandora = require('../../bower_components/pandora/lib/pandora');
var cg = require("../../codegraph");

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
        loader.load(graph, [{
            "cgId": "0",
            "cgInputs": [
                {
                    "cgType": "Point", // Will be used by default if not found
                    "cgName": "in",
                    "cgValueType": "Number"
                }
            ]
        }, {
            "cgId": "1",
            "cgOutputs": [
                {
                    "cgType": "Point", // Will be used by default if not found
                    "cgName": "out",
                    "cgValue": 64,
                    "cgValueType": "Number" // Will be deduced by default from value if possible
                }
            ]
        }], [
            {"cgOutputBlockId": "1", "cgOutputName": "out", "cgInputBlockId": "0", "cgInputName": "in"}
        ]);
        expect(graph.cgBlocks.length).to.be.equal(2);
        expect(graph.cgBlocks.length).to.be.equal(blockCreateEmit);
        expect(pointCreateEmit).to.be.equal(2);
        expect(graph.cgConnections.length).to.be.equal(1);
        expect(graph.blockById("1").outputByName("out").cgValue).to.be.equal(64);
        expect(graph.blockById("0").inputByName("in").cgValueType).to.be.equal("Number");
        graph.blockById("1").outputByName("out").cgValue = 128;
        expect(graph.blockById("1").outputByName("out").cgValue).to.be.equal(128);
        expect(graph.connectionsByPoint(graph.blockById("1").outputByName("out"))[0]).to.be.equal(graph.connectionsByPoint(graph.blockById("0").inputByName("in"))[0]);
    });
    it("should test block copy", function () {
        var graph = new cg.Graph();
        var loader = new cg.JSONLoader();
        loader.load(graph, [{
            "cgId": "0",
            "cgInputs": [
                {
                    "cgType": "Point", // Will be used by default if not found
                    "cgName": "in",
                    "cgValueType": "Number"
                }
            ]
        }, {
            "cgId": "1",
            "cgOutputs": [
                {
                    "cgType": "Point", // Will be used by default if not found
                    "cgName": "out",
                    "cgValue": 64,
                    "cgValueType": "Number" // Will be deduced by default from value if possible
                }
            ]
        }], [
            {"cgOutputBlockId": "1", "cgOutputName": "out", "cgInputBlockId": "0", "cgInputName": "in"}
        ]);
        var blockWithInput = graph.blockById("0");
        blockWithInput.cgName = "My custom name";
        var blockWithInputClone = blockWithInput.clone(graph);
        expect(blockWithInput.cgName).to.be.equal(blockWithInputClone.cgName);
        expect(blockWithInput.cgOutputs.length).to.be.equal(blockWithInputClone.cgOutputs.length);
        expect(blockWithInput.cgInputs.length).to.be.equal(blockWithInputClone.cgInputs.length);
    });
    it("should test block connections and streams", function () {
        var graph = new cg.Graph();
        var loader = new cg.JSONLoader();
        loader.load(graph, [{
            "cgId": "0",
            "cgInputs": [
                {
                    "cgType": "Stream",
                    "cgName": "in"
                }
            ]
        }, {
            "cgId": "1",
            "cgOutputs": [
                {
                    "cgType": "Stream",
                    "cgName": "out"
                }
            ]
        }], [
            {"cgOutputBlockId": "1", "cgOutputName": "out", "cgInputBlockId": "0", "cgInputName": "in"}
        ]);
        expect(function() {
            graph.blockById("0").inputByName("in").cgValue = 32;
        }).to.throw(/Cannot change cgValueType to a non allowed type `Number`/);
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
        ])).to.throw(/id `\d` already exists/); // cgId is not unique
        expect(loader.load.bind(loader, graph, [
            {
                "cgId": "2",
                "cgOutputs": [
                    {"": ""}
                ]
            }
        ])).to.throw(/`cgName` is required/);
        expect(loader.load.bind(loader, graph, [
            {
                "cgId": "3",
                "cgOutputs": [
                    {"cgName": "hello"}
                ]
            }
        ])).to.throw(/cgValueType is required/);
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
                        "cgValueType": "String"
                    }
                ]
            }
        ], [{
            "cgOutputBlockId": "4",
            "cgOutputName": "hello",
            "cgInputBlockId": "5",
            "cgInputName": "hello"
        }])).to.throw(/Cannot connect two points of different value types: `[0-9a-zA-Z-_]+` and `[0-9a-zA-Z-_]+`/);
        expect(loader.load.bind(loader, graph, [
            {
                "cgId": "7",
                "cgOutputs": [
                    {
                        "cgName": "hello",
                        "cgValueType": "Number"
                    }
                ]
            },
            {
                "cgId": "8",
                "cgInputs": [
                    {
                        "cgName": "hello",
                        "cgValueType": "Number"
                    }
                ]
            },
            {
                "cgId": "9",
                "cgInputs": [
                    {
                        "cgName": "hello",
                        "cgValueType": "Number"
                    }
                ]
            }
        ], [
            {"cgOutputBlockId": "7", "cgOutputName": "hello", "cgInputBlockId": "8", "cgInputName": "hello"},
            {"cgOutputBlockId": "7", "cgOutputName": "hello", "cgInputBlockId": "9", "cgInputName": "hello"}
        ])).to.throw(/Cannot accept more than `\d` connection/); // Too many connections on one output point
    });
});