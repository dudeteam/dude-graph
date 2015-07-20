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
        loader.load(graph, [
            {
                "cgId": "0",
                "cgInputs": [
                    {
                        "cgType": "Point",
                        "cgName": "in",
                        "cgValue": 64
                    }
                ]
            },
            {
                "cgId": "1",
                "cgOutputs": [
                    {
                        "cgType": "Point",
                        "cgName": "out",
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
        expect(graph.blockById("0").inputByName("in").cgValue).to.be.equal(64);
        expect(graph.blockById("1").outputByName("out").cgValueType).to.be.equal("Number");
        graph.blockById("0").inputByName("in").cgValue = 128;
        expect(graph.blockById("0").inputByName("in").cgValue).to.be.equal(128);
        expect(graph.connectionsByPoint(graph.blockById("1").outputByName("out"))[0]).to.be.equal(graph.connectionsByPoint(graph.blockById("0").inputByName("in"))[0]);
    });
    it("should test block copy", function () {
        var graph = new cg.Graph();
        var loader = new cg.JSONLoader();
        loader.load(graph, [
            {
                "cgId": "0",
                "cgInputs": [
                    {
                        "cgType": "Point",
                        "cgName": "in",
                        "cgValue": 32
                    }
                ]
            }, {
                "cgId": "1",
                "cgOutputs": [
                    {
                        "cgType": "Point",
                        "cgName": "out",
                        "cgValueType": "Number"
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
        expect(blockWithInput.inputByName("in").cgValue).to.be.equal(blockWithInputClone.inputByName("in").cgValue);
    });
    it("should test block connections and streams", function () {
        var graph = new cg.Graph();
        var loader = new cg.JSONLoader();
        loader.load(graph, [
            {
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
        expect(function () {
            graph.blockById("0").inputByName("in").cgValue = 32;
        }).to.throw(/Cannot change cgValueType to a non allowed type `Number`/);
    });
    it("should test many connections and clone blocks and connections", function () {
        var graph = new cg.Graph();
        var loader = new cg.JSONLoader();
        loader.load(graph, [
                {
                    "cgId": "UniqueIdCanBeAString",
                    "cgName": "on_start",
                    "cgOutputs": [
                        {
                            "cgType": "Stream",
                            "cgName": "out"
                        }
                    ]
                },
                {
                    "cgId": "0",
                    "cgName": "Sum",
                    "cgInputs": [
                        {
                            "cgType": "Point",
                            "cgName": "a",
                            "cgValue": 32
                        },
                        {
                            "cgType": "Point",
                            "cgName": "b",
                            "cgValue": 64
                        }
                    ],
                    "cgOutputs": [
                        {
                            "cgType": "Point",
                            "cgName": "sum",
                            "cgValueType": "Number"
                        }
                    ]
                },
                {
                    "cgId": "1",
                    "cgName": "Exit with code",
                    "cgOutputs": [
                        {
                            "cgType": "Stream",
                            "cgName": "out"
                        }
                    ],
                    "cgInputs": [
                        {
                            "cgType": "Stream",
                            "cgName": "in"
                        },
                        {
                            "cgType": "Point",
                            "cgName": "exit code",
                            "cgValue": 0
                        }
                    ]
                }
            ],
            [
                {
                    "cgOutputBlockId": "UniqueIdCanBeAString",
                    "cgOutputName": "out",
                    "cgInputBlockId": "1",
                    "cgInputName": "in"
                },
                {
                    "cgOutputBlockId": "0",
                    "cgOutputName": "sum",
                    "cgInputBlockId": "1",
                    "cgInputName": "exit code"
                }
            ]
        );
        var blocksCloned = graph.cloneBlocks([graph.blockById("0"), graph.blockById("1")]);
        expect(blocksCloned[0].cgName).to.be.equal(graph.blockById("0").cgName);
        expect(blocksCloned[1].cgName).to.be.equal(graph.blockById("1").cgName);
        expect(graph.cgConnections[2].cgOutputPoint.cgName).to.be.equal(graph.cgConnections[1].cgOutputPoint.cgName);
        expect(graph.cgConnections[2].cgInputPoint.cgName).to.be.equal(graph.cgConnections[1].cgInputPoint.cgName);
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
                    {"cgType": "Point", "cgName": "hello"}
                ]
            }
        ])).to.throw(/cgValueType is required/);
        expect(loader.load.bind(loader, graph, [
            {
                "cgId": "4",
                "cgOutputs": [
                    {
                        "cgType": "Point",
                        "cgName": "hello",
                        "cgValueType": "Number"
                    }
                ]
            },
            {
                "cgId": "5",
                "cgInputs": [
                    {
                        "cgType": "Point",
                        "cgName": "hello",
                        "cgValueType": "String"
                    }
                ]
            }
        ], [
            {
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
                        "cgType": "Point",
                        "cgName": "hello",
                        "cgValueType": "Number"
                    }
                ]
            },
            {
                "cgId": "8",
                "cgInputs": [
                    {
                        "cgType": "Point",
                        "cgName": "hello",
                        "cgValueType": "Number"
                    }
                ]
            },
            {
                "cgId": "9",
                "cgInputs": [
                    {
                        "cgType": "Point",
                        "cgName": "hello",
                        "cgValueType": "Number"
                    }
                ]
            }
        ], [
            {"cgOutputBlockId": "7", "cgOutputName": "hello", "cgInputBlockId": "8", "cgInputName": "hello"},
            {"cgOutputBlockId": "7", "cgOutputName": "hello", "cgInputBlockId": "9", "cgInputName": "hello"}
        ])).to.throw(/Cannot accept more than `\d` connection/);
    });
});