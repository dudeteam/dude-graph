const DUDE_GRAPH_MODELS = [
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
];
const DUDE_GRAPH_DEFAULT_GRAPH_DATA = {};
const DUDE_GRAPH_DEFAULT_RENDERER_DATA = {};
const DUDE_GRAPH_BLOCK_TYPES = [];
const DUDE_GRAPH_POINT_TYPES = [
    {"point": "Stream", "type": dudeGraph.Stream}
];
const DUDE_GRAPH_RENDER_BLOCK_TYPES = [];