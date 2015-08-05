var TEST_SHOOT_BEHAVIOR_GRAPH_DATA = {
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
        }
    ],
    "connections": [
        {"cgOutputBlockId": "0", "cgOutputName": "out", "cgInputBlockId": "1", "cgInputName": "in"},
        {"cgOutputBlockId": "2", "cgOutputName": "value", "cgInputBlockId": "1", "cgInputName": "test"},
        {"cgOutputBlockId": "4", "cgOutputName": "value", "cgInputBlockId": "2", "cgInputName": "first"},
        //{"cgOutputBlockId": "4", "cgOutputName": "value", "cgInputBlockId": "9", "cgInputName": "this"},
        //{"cgOutputBlockId": "4", "cgOutputName": "value", "cgInputBlockId": "14", "cgInputName": "this"},
        {"cgOutputBlockId": "5", "cgOutputName": "value", "cgInputBlockId": "2", "cgInputName": "second"}
    ]
};
var TEST_SHOOT_BEHAVIOR_RENDERER_DATA = {
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
            "position": [300, 250],
            "parent": "0"
        },
        {
            "id": "5",
            "cgBlock": "5",
            "position": [300, 330],
            "parent": "0"
        },
        {
            "id": "6",
            "cgBlock": "6",
            "position": [500, 230],
            "parent": "0"
        },
        {
            "id": "7",
            "cgBlock": "7",
            "position": [500, 310],
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
            "position": [300, 480],
            "parent": "1"
        },
        {
            "id": "10",
            "cgBlock": "4",
            "position": [300, 600]
        },
        {
            "id": "11",
            "cgBlock": "15",
            "position": [300, 680]
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
            "position": [700, 220]
        },
        {
            "id": "16",
            "cgBlock": "14",
            "position": [700, 30]
        },
        {
            "id": "17",
            "cgBlock": "4",
            "position": [700, 150]
        }
    ]
};