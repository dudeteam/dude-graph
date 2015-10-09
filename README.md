CodeGraph
=========

CodeGraph is a graphic tool to draw graphs which represent some logical behaviors. You can create actions, connect
them together and order them into groups.

![Graph](dude-graph.png)

TODO
----

- Handle types
- Handle value assignation while using models (removing cgModel from json?)

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

And you can also override the following static methods to add a custom rendering (c.f. lib/blocks for concrete examples):

### rendererBlockCreator(renderer)

Specifies how the svg of this block is created. It takes the block information to create a meaningful svg.

### rendererBlockUpdater(renderer)

This one takes the svg created in the previous method and update its appearance according changes. You should
define the style of the properties of the blocks that can be changed dynamically (like its name for example).

### pointPositionGetter(rendererPoint, offsetX, offsetY)

Finally, this method should be overwritten to specify how to compute the position of each point relative to the block.
Indeed, depending on the shape of the block the calculation of this position might change.
