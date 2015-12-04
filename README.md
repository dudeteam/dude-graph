DudeGraph
=========

DudeGraph is a graphic tool to allow users to create content from a simple node-based interface.
You can use dude-graph to create your own graphical language! And offer the ability to create new content without programming.

![Graph](dude-graph.png)

# Overview

DudeGraph is a set of two Polymer elements: `dude-graph-editor` and `dude-graph-inspector`

`dude-graph-editor` represents the SVG node-based interface, handles groups and blocks drag and drop and connection linking between block points.
`dude-graph-inspector` manipulates the editor and allows to create/remove groups and blocks, zoom to fit and edit selected block properties.

## Installation

``` bash
bower install --save dude-graph
```

## Example

index.html
``` html
<!DOCTYPE html>
<html>
<head>
    <script src="bower_components/webcomponentsjs/webcomponents-lite.min.js"></script>
    <link rel="import" href="dude-graph-example.html">
</head>
<body>
<dude-graph-example></dude-graph-example>
</body>
</html>
```
dude-graph-example.html
``` html
<link rel="import" href="bower_components/polymer/polymer.html">
<link rel="import" href="bower_components/dude-style/dude-style.html">
<link rel="import" href="bower_components/dude-graph/dude-graph-editor.html">
<link rel="import" href="bower_components/dude-graph/dude-graph-inspector.html">
<dom-module id="dude-graph-example">
    <template>
        <div class="layout horizontal fit">
            <dude-graph-editor id="editor"
                               class="panel layout horizontal flex-2"
                               graph-data="[[ graphData ]]"
                               renderer-data="[[ rendererData ]]">
            </dude-graph-editor>
            <dude-graph-inspector id="inspector"
                                  class="panel layout horizontal flex"
                                  model-data="[[ modelData ]]">
            </dude-graph-inspector>
        </div>
    </template>
    <script>
        Polymer({
            is: "dude-graph-example",
            properties: {
                "graphData": {
                    "type": Object,
                    "value": {
                        "blocks": [
                            {
                                "cgType": "Block",
                                "cgId": "0",
                                "cgName": "Start",
                                "cgOutputs": [
                                    {
                                        "cgType": "Stream",
                                        "cgName": "out"
                                    }
                                ]
                            },
                            {
                                "cgType": "Block",
                                "cgId": "1",
                                "cgName": "End",
                                "cgInputs": [
                                    {
                                        "cgType": "Stream",
                                        "cgName": "in"
                                    }
                                ]
                            }
                        ]
                    }
                },
                "rendererData": {
                    "type": Object,
                    "value": {
                        "zoom": {
                            "translate": [100, 0],
                            "scale": 1
                        },
                        "blocks": [
                            {
                                "id": "0",
                                "cgBlock": "0",
                                "position": [100, 100]
                            },
                            {
                                "id": "1",
                                "cgBlock": "1",
                                "position": [350, 150]
                            }
                        ]
                    }
                },
                "modelData": {
                    "type": Array,
                    "value": [
                        {
                            "item": {
                                "name": "Middle",
                                "icon": "fa fa-plus-square",
                                "data": {
                                    "cgType": "Block",
                                    "cgName": "Middle",
                                    "cgInputs": [
                                        {
                                            "cgType": "Stream",
                                            "cgName": "in"
                                        }
                                    ],
                                    "cgOutputs": [
                                        {
                                            "cgType": "Stream",
                                            "cgName": "out"
                                        }
                                    ]
                                }
                            }
                        }
                    ]
                }
            },

            ready: function () {
                this.$.inspector.editor = this.$.editor; // Attach the editor to the inspector
                this.$.editor.load();
                this.$.inspector.load();
            }
        });
    </script>
</dom-module>
```

## I don't want to use Polymer

That's perfectly fine, you can achieve the same result as with Polymer, feel free to explore the elements `dude-graph-editor` and `dude-graph-inspector` to see what's under the hood.

## Contribute

If you want to contribute, run the following command to test dude-graph:
``` gulp ```

Then open your favorite browser:
``` http://localhost:8080/components/dude-graph/ ``` for the Polymer documentation
``` http://localhost:8080/components/dude-graph/demo/ ``` for the demo.

Note: ``` gulp ``` will minify and concat all the sources in lib/ into the root script file ``` dude-graph.js ``` and will start ``` polyserve ``` on the default port (8080)

## Is it any good?

[Yes](http://news.ycombinator.com/item?id=3067434)