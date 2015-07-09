var assert = require("assert");
var pandora = require('../../bower_components/pandora/lib/pandora');
var cg = require("../../codegraph");

var blocks = [
    {
        "cgType": "Function",
        "cgId": 0,
        "cgInputs": [
            {"in": 32},
            {"stuff": "the_string"}
        ],
        "cgOutputs": [
            {"out": true}
        ]
    },
    {
        "cgType": "Function"
    }
];

describe("Graph", function () {
    it("should create a new graph with default blocks", function () {
        var graph = new cg.Graph();
        pandora.forEach(blocks, function (block) {
            var node = new cg[block.cgType](graph, block.cgId);
            graph.addBlock(node);
            if (block.cgInputs) {
                var in_created = false;
                node.on('in-created', function() {
                    in_created = true;
                });
                node.addInputs(block.cgInputs);
                node.addOutputs(block.cgOutputs);
                assert.ok(in_created);
                assert.equal(pandora.typename(node.in), "Number");
                assert.equal(pandora.typename(node.stuff), "String");
                assert.equal(node.in, 32);
                try {
                    node.in = "Stuff";
                } catch (ex) {
                    console.log(ex);
                }
                try {
                    node.addOutputs(block.cgInputs);
                } catch (ex) {
                    console.log(ex);
                }
            }
        });
        assert.equal(graph._blocks.length, 2);
    });
});