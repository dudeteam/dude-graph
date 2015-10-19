DudeGraph
=========

DudeGraph is a graphic tool to draw graphs which represent some logical behaviors. You can create actions, connect
them together and order them into groups.

![Graph](dude-graph.png)

How to create a custom block?
-----------------------------

Create a class which inherits from dudeGraph.Block as follow:

```js
dudeGraph.MyBlock = function (graph, data) {
    dudeGraph.Block.call(this, graph, data, "MyBlock");
};
```

Then, you should add an helper to create your block from a simplified JSON. For example, just specify the valueType
instead of all its inputs and outputs:

```js
dudeGraph.MyBlock.buildBlock = function (graph, data) {
    return new dudeGraph.MyBlock(cgGraph, _.merge(data, {
        "cgOutputs": [
            {
                "cgType": "Point",
                "cgName": "value",
                "cgValueType": data.cgValueType,
                "singleConnection": false
            }
        ]
    }, dudeGraph.ArrayMerger));
};
```