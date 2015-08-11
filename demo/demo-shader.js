var DEMO_SHADER_GRAPH_DATA = {
    "blocks": [
        {
            "cgId": "0",
            "cgModel": "checker"
        },
        {
            "cgId": "1",
            "cgModel": "sprite"
        },
        {
            "cgId": "2",
            "cgModel": "mix"
        },
        {
            "cgId": "3",
            "cgModel": "material_output"
        },
        {
            "cgId": "4",
            "cgType": "Variable",
            "cgName": "player_texture",
            "cgValueType": "Image"
        },
        {
            "cgId": "5",
            "cgType": "Value",
            "cgValue": "#ffffff",
            "cgValueType": "Color"
        },
        {
            "cgId": "6",
            "cgType": "Value",
            "cgValue": "0.5",
            "cgValueType": "Number"
        }
    ],
    "connections": [
        {"cgOutputBlockId": "0", "cgOutputName": "value", "cgInputBlockId": "2", "cgInputName": "x"},
        {"cgOutputBlockId": "1", "cgOutputName": "value", "cgInputBlockId": "2", "cgInputName": "y"},
        {"cgOutputBlockId": "2", "cgOutputName": "value", "cgInputBlockId": "3", "cgInputName": "color"},
        {"cgOutputBlockId": "4", "cgOutputName": "value", "cgInputBlockId": "1", "cgInputName": "texture"},
        {"cgOutputBlockId": "5", "cgOutputName": "value", "cgInputBlockId": "1", "cgInputName": "color"},
        {"cgOutputBlockId": "6", "cgOutputName": "value", "cgInputBlockId": "2", "cgInputName": "a"}
    ]
};
var DEMO_SHADER_RENDERER_DATA = {
    "config": {
        "zoom": {
            "translate": [0, 0],
            "scale": 1
        }
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
            "position": [100, 200]
        },
        {
            "id": "2",
            "cgBlock": "2",
            "position": [300, 150]
        },
        {
            "id": "3",
            "cgBlock": "3",
            "position": [500, 150]
        },
        {
            "id": "4",
            "cgBlock": "4",
            "position": [100, 300]
        },
        {
            "id": "5",
            "cgBlock": "5",
            "position": [100, 360]
        },
        {
            "id": "6",
            "cgBlock": "6",
            "position": [300, 260]
        }
    ],
    "groups": [],
    "connections": [
        {"outputBlockId": "0", "outputName": "value", "inputBlockId": "2", "inputName": "x"},
        {"outputBlockId": "1", "outputName": "value", "inputBlockId": "2", "inputName": "y"},
        {"outputBlockId": "2", "outputName": "value", "inputBlockId": "3", "inputName": "color"},
        {"outputBlockId": "4", "outputName": "value", "inputBlockId": "1", "inputName": "texture"},
        {"outputBlockId": "5", "outputName": "value", "inputBlockId": "1", "inputName": "color"},
        {"outputBlockId": "6", "outputName": "value", "inputBlockId": "2", "inputName": "a"}
    ]
};