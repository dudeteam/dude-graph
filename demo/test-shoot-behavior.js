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
        }
    ],
    "connections": [
        {"cgOutputBlockId": "0", "cgOutputName": "out", "cgInputBlockId": "1", "cgInputName": "in"}
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
            "type": "group",
            "description": "Shoots if enough bullets"
        },
        {
            "id": "1",
            "type": "group",
            "description": "Initializes the number of bullets"
        },
        {
            "id": "2",
            "type": "group",
            "description": "Show the current number of FPS"
        }
    ],
    "blocks": [
        {
            "type": "block",
            "id": "0",
            "position": [100, 100],
            "parent": "0"
        },
        {
            "type": "block",
            "id": "1",
            "position": [300, 50],
            "parent": "0"
        },
        {
            "type": "block",
            "id": "2",
            "position": [300, 150],
            "parent": "0"
        },
        {
            "type": "block",
            "id": "3",
            "position": [500, 100],
            "parent": "0"
        },
        {
            "type": "block",
            "id": "4",
            "position": [300, 250],
            "parent": "0"
        },
        {
            "type": "block",
            "id": "5",
            "position": [300, 330],
            "parent": "0"
        },
        {
            "type": "block",
            "id": "6",
            "position": [500, 230],
            "parent": "0"
        },
        {
            "type": "block",
            "id": "7",
            "position": [500, 310],
            "parent": "0"
        },
        {
            "type": "block",
            "id": "8",
            "position": [100, 500],
            "parent": "1"
        },
        {
            "type": "block",
            "id": "9",
            "position": [300, 480],
            "parent": "1"
        },
        {
            "type": "block",
            "id": "4",
            "position": [300, 600]
        },
        {
            "type": "block",
            "id": "5",
            "position": [300, 680]
        },
        {
            "type": "block",
            "id": "10",
            "position": [500, 500],
            "parent": "2"
        },
        {
            "type": "block",
            "id": "11",
            "position": [700, 500],
            "parent": "2"
        },
        {
            "type": "block",
            "id": "12",
            "position": [700, 600],
            "parent": "2"
        }
    ]
};