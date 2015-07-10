var assert = require("assert");
var pandora = require('../../bower_components/pandora/lib/pandora');
var cg = require("../../codegraph");

var blocks = [
    {
        "cgType": "Function",
        "cgId": "0",
        "cgInputs": [
            {
                "in": 32
            },
            {
                "stuff": "the_string"
            }
        ],
        "cgOutputs": [
            {
                "out": {
                    "type": "Direction",
                    "cgId": 1,
                    "input": "in"
                }
            }
        ]
    },
    {
        "cgType": "Function",
        "cgId": "1",
        "cgInputs": [
            {
                "in": {
                    "type": "Direction",
                    "cgId": 0,
                    "output": "out"
                }
            }
        ]
    }
];

describe("Graph", function () {
    it("should create a new graph with default blocks", function () {
        var graph = new cg.Graph();
        var loader = new cg.JSONLoader();

        loader.load(graph, blocks);
        assert.equal(graph.blocks.length, 2);
    });
});