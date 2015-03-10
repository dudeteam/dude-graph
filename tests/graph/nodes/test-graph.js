var assert = require("assert");
var cg = require("../../../dist/codegraph.min");

describe("Graph creation", function () {
    it("should create a new empty graph", function () {
        var graph = new cg.Graph();

        assert.equal(graph.children._nodes.length, 0);
    });
    it("should create a new empty graph and add one child", function () {
        var graph = new cg.Graph();
        var group = new cg.Group(100);
        var ok = false;

        graph.on("node.add", function (node) {
            assert.equal(node, group);
            ok = true;
        });
        graph.addNode(group, graph);
        assert.equal(graph.children._nodes.length, 1);
        assert.ok(ok);
    });
    it("should create a new empty graph and add one graph as a child an fail adding graph", function () {
        var graph = new cg.Graph();
        var graph2 = new cg.Graph();
        var ok = true;

        graph.on("error", function (node) {
            ok = true;
        });
        graph.on("node.add", function (node) {
            assert.fail();
        });
        graph.addNode(graph2, graph);
        assert.equal(graph.children._nodes.length, 0);
        assert.ok(ok);
    });
    it("should create a new empty graph and add multiple childs", function () {
        var graph = new cg.Graph();
        var toAdd = 20;
        var added = 0;

        graph.on("node.add", function (node) {
            ++added;
        });
        for (var i = 0; i < toAdd; ++i) {
            graph.addNode(new cg.Group(i), graph);
        }
        assert.equal(graph.children._nodes.length, toAdd);
        assert.equal(added, toAdd);
    });
    it("should create a new empty graph and create 2 groups, add a child in the first group and moves it to the other group", function () {
        var graph = new cg.Graph();
        var group1 = new cg.Group(1);
        var group2 = new cg.Group(2);
        var child = new cg.Group(3);
        var addGroup1 = false;
        var moveGroup2 = false;
        graph.on("node.add", function (node) {
            if (node === child) {
                addGroup1 = true;
            }
        });
        graph.on("node.change-parent", function (node, oldParent, newParent) {
            if (node === child && oldParent === group1 && newParent === group2) {
                moveGroup2 = true;
            }
        });
        graph.addNode(group1, graph);
        graph.addNode(group2, graph);
        assert.equal(graph.children._nodes.length, 2);
        graph.addNode(child, group1);
        assert.equal(group1.children._nodes.length, 1);
        graph.moveNode(child, group2);
        assert.ok(addGroup1);
        assert.ok(moveGroup2);
    });
});