var DEMO_SHOOT_BEHAVIOR_GRAPH_DATA = {
    "blocks": [
        {
            "cgId": "0",
            "cgModel": "on_key_down"
        },
        {
            "cgId": "1",
            "cgType": "Condition"
        },
        {
            "cgId": "2",
            "cgModel": "greater_than"
        },
        {
            "cgId": "3",
            "cgModel": "Entity.add_entity"
        },
        {
            "cgId": "4",
            "cgType": "Variable",
            "cgValueType": "Number",
            "cgName": "nb_bullets"
        },
        {
            "cgId": "5",
            "cgType": "Value",
            "cgValueType": "Number",
            "cgValue": 10
        },
        {
            "cgId": "6",
            "cgType": "Variable",
            "cgValueType": "Entity",
            "cgName": "entity"
        },
        {
            "cgId": "7",
            "cgType": "Value",
            "cgValueType": "String",
            "cgValue": "bullet"
        },
        {
            "cgId": "8",
            "cgModel": "on_start"
        },
        {
            "cgId": "9",
            "cgType": "Assignation",
            "cgValueType": "Number"
        },
        {
            "cgId": "10",
            "cgModel": "on_update"
        },
        {
            "cgId": "11",
            "cgModel": "info"
        },
        {
            "cgId": "12",
            "cgModel": "to_string"
        },
        {
            "cgId": "13",
            "cgModel": "subtract"
        },
        {
            "cgId": "14",
            "cgType": "Assignation",
            "cgValueType": "Number"
        },
        {
            "cgId": "15",
            "cgType": "Value",
            "cgValueType": "Number",
            "cgValue": 50
        },
        {
            "cgId": "16",
            "cgType": "Value",
            "cgValueType": "Number",
            "cgValue": 1
        }
    ],
    "connections": [
        {"cgOutputBlockId": "0", "cgOutputName": "out", "cgInputBlockId": "1", "cgInputName": "in"},
        {"cgOutputBlockId": "2", "cgOutputName": "value", "cgInputBlockId": "1", "cgInputName": "test"},
        {"cgOutputBlockId": "4", "cgOutputName": "value", "cgInputBlockId": "2", "cgInputName": "first"},
        {"cgOutputBlockId": "4", "cgOutputName": "value", "cgInputBlockId": "9", "cgInputName": "this"},
        {"cgOutputBlockId": "4", "cgOutputName": "value", "cgInputBlockId": "14", "cgInputName": "this"},
        {"cgOutputBlockId": "5", "cgOutputName": "value", "cgInputBlockId": "2", "cgInputName": "second"},
        {"cgOutputBlockId": "1", "cgOutputName": "true", "cgInputBlockId": "3", "cgInputName": "in"},
        {"cgOutputBlockId": "6", "cgOutputName": "value", "cgInputBlockId": "3", "cgInputName": "this"},
        {"cgOutputBlockId": "7", "cgOutputName": "value", "cgInputBlockId": "3", "cgInputName": "name"}
    ]
};
var DEMO_SHOOT_BEHAVIOR_RENDERER_DATA = {
    "config": {
        "zoom": {
            "translate": [0, 0],
            "scale": 1
        }
    },
    "groups": [
        {
            "id": "0",
            "description": "Shoots if enough bullets"
        },
        {
            "id": "1",
            "description": "Initializes the number of bullets"
        },
        {
            "id": "2",
            "description": "Shows the current number of FPS"
        }
    ],
    "blocks": [
        {

            "id": "0",
            "cgBlock": "0",
            "position": [100, 100],
            "parent": "0"
        },
        {
            "id": "1",
            "cgBlock": "1",
            "position": [300, 50],
            "parent": "0"
        },
        {
            "id": "2",
            "cgBlock": "2",
            "position": [300, 150],
            "parent": "0"
        },
        {
            "id": "3",
            "cgBlock": "3",
            "position": [500, 100],
            "parent": "0"
        },
        {
            "id": "4",
            "cgBlock": "4",
            "position": [300, 240],
            "parent": "0"
        },
        {
            "id": "5",
            "cgBlock": "5",
            "position": [300, 310],
            "parent": "0"
        },
        {
            "id": "6",
            "cgBlock": "6",
            "position": [500, 210],
            "parent": "0"
        },
        {
            "id": "7",
            "cgBlock": "7",
            "position": [500, 280],
            "parent": "0"
        },
        {
            "id": "8",
            "cgBlock": "8",
            "position": [100, 500],
            "parent": "1"
        },
        {
            "id": "9",
            "cgBlock": "9",
            "position": [300, 500],
            "parent": "1"
        },
        {
            "id": "10",
            "cgBlock": "4",
            "position": [300, 610],
            "parent": "1"
        },
        {
            "id": "11",
            "cgBlock": "15",
            "position": [300, 680],
            "parent": "1"
        },
        {
            "id": "12",
            "cgBlock": "10",
            "position": [500, 500],
            "parent": "2"
        },
        {
            "id": "13",
            "cgBlock": "11",
            "position": [700, 500],
            "parent": "2"
        },
        {
            "id": "14",
            "cgBlock": "12",
            "position": [700, 600],
            "parent": "2"
        },
        {
            "id": "15",
            "cgBlock": "13",
            "position": [700, 220],
            "parent": "0"
        },
        {
            "id": "16",
            "cgBlock": "14",
            "position": [700, 30],
            "parent": "0"
        },
        {
            "id": "17",
            "cgBlock": "4",
            "position": [700, 140],
            "parent": "0"
        },
        {
            "id": "18",
            "cgBlock": "4",
            "position": [700, 310],
            "parent": "0"
        },
        {
            "id": "19",
            "cgBlock": "16",
            "position": [700, 380],
            "parent": "0"
        }
    ],
    "connections": [
        {"outputBlockId": "0", "outputName": "out", "inputBlockId": "1", "inputName": "in"},
        {"outputBlockId": "2", "outputName": "value", "inputBlockId": "1", "inputName": "test"},
        {"outputBlockId": "4", "outputName": "value", "inputBlockId": "2", "inputName": "first"},
        {"outputBlockId": "10", "outputName": "value", "inputBlockId": "9", "inputName": "this"},
        {"outputBlockId": "17", "outputName": "value", "inputBlockId": "16", "inputName": "this"},
        {"outputBlockId": "5", "outputName": "value", "inputBlockId": "2", "inputName": "second"},
        {"outputBlockId": "5", "outputName": "value", "inputBlockId": "2", "inputName": "second"},
        {"outputBlockId": "1", "outputName": "true", "inputBlockId": "3", "inputName": "in"},
        {"outputBlockId": "6", "outputName": "value", "inputBlockId": "3", "inputName": "this"},
        {"outputBlockId": "7", "outputName": "value", "inputBlockId": "3", "inputName": "name"}
    ]
};