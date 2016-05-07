DudeGraph
=========

[![Build Status](https://travis-ci.org/dudeteam/dude-graph.svg?branch=master)](https://travis-ci.org/dudeteam/dude-graph)

DudeGraph is a graphic tool to allow users to create content from a simple node-based interface.
You can use dude-graph to create your own graphical language!

![Graph](dude-graph.png)

## Installation

``` bash
bower install --save dude-graph
```

## Example

``` html
<link rel="import" href="../../../polymer/polymer.html">
<link rel="import" href="../../dude-graph.html">
<dom-module id="demo-dude-graph">
    <template>
        <dude-graph id="dudeGraph"
                    graph-data="[[ graphData ]]"
                    renderer-data="[[ rendererData ]]"
                    models="[[ models ]]">
        </dude-graph>
    </template>
    <script>
        Polymer({
            is: "demo-dude-graph",
            properties: {
                "graphData": {"type": Object},
                "rendererData": {"type": Object},
                "models": {
                    "type": Array,
                    "value": [
                        {
                            "item": {
                                "name": "Function",
                                "icon": "fa fa-rocket",
                                "data": {
                                    "blockType": "Block",
                                    "blockName": "Function",
                                    "blockInputs": [
                                        {
                                            "pointType": "StreamPoint",
                                            "pointName": "in",
                                            "pointValueType": "Stream"
                                        }
                                    ],
                                    "blockOutputs": [
                                        {
                                            "pointType": "StreamPoint",
                                            "pointName": "first",
                                            "pointValueType": "Stream"
                                        },
                                        {
                                            "pointType": "StreamPoint",
                                            "pointName": "second",
                                            "pointValueType": "Stream"
                                        }
                                    ]
                                }
                            }
                        }
                    ]
                }
            },
            listeners: {
                "dude-graph-save": "_graphSave",
                "dude-graph-build": "_graphBuild",
                "dude-graph-error": "_graphError",
                "dude-graph-success": "_graphSuccess"
            },
            ready: function () {
                this.$.dudeGraph.initialize();
            }
        });
    </script>
</dom-module>
```

## I don't want to use Polymer

That's perfectly fine, you can achieve the same result as with Polymer, feel free to explore the element `dude-graph` to see what's under the hood.