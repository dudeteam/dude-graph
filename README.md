DudeGraph
=========

DudeGraph is a graphic tool to draw graphs which represent some logical behaviors. You can create actions, connect
them together and order them into groups.

![Graph](dude-graph.png)

Getting Started
---------------

DudeGraph is contains a javascript library and 2 Polymer elements. To use it in your project, simply install it using bower:

```sh
$ bower install dude-graph --save
```

Then, import it and use it:

```html
<link rel="import" href="bower_components/dude-graph/dude-graph-editor.html">
<link rel="import" href="bower_components/dude-graph/dude-graph-inspector.html">

(...)

<dude-graph-editor graph-data="[[ graphData ]]"
                   renderer-data="[[ rendererData ]]"
                   renderer-config="[[ rendererConfig ]]"
                   on-dude-graph-editor-error="_handleDudeGraphEditorError">
</dude-graph-editor>
<dude-graph-inspector model-data="[[ modelData ]]"
                      on-dude-graph-inspector-save="_dudeGraphInspectorSave">
</dude-graph-inspector>

```

Contribute
----------

If you want to test dude-graph to add new features, you should fork the repository. Then, run the following command in the root folder:

```sh
$ polyserve -p 4242
```

Then go to `http:://localhost:4242/components/dude-graph/` for the documentation, and `http:://localhost:4242/components/dude-graph/demo/` for the demo.

Moreover, if you want to change code within the js library (dude-graph.js), you need to run `gulp watch` so the library code will be automatically updated each time you change a file.

Create a custom block
---------------------

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

Create a custom builder
-----------------------

TODO
