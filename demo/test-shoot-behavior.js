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
        }
    ],
    "blocks": [
        {
            "type": "block",
            "id": "0",
            "position": [100, 150],
            "parent": "0"
        },
        {
            "type": "block",
            "id": "1",
            "position": [300, 100],
            "parent": "0"
        },
        {
            "type": "block",
            "id": "2",
            "position": [300, 200],
            "parent": "0"
        },
        {
            "type": "block",
            "id": "3",
            "position": [500, 150],
            "parent": "0"
        },
        {
            "type": "block",
            "id": "4",
            "position": [300, 300],
            "parent": "0"
        },
        {
            "type": "block",
            "id": "5",
            "position": [300, 380],
            "parent": "0"
        },
        {
            "type": "block",
            "id": "6",
            "position": [500, 280],
            "parent": "0"
        },
        {
            "type": "block",
            "id": "7",
            "position": [500, 360],
            "parent": "0"
        },
        {
            "type": "block",
            "id": "8",
            "position": [100, 500]
        },
        {
            "type": "block",
            "id": "9",
            "position": [300, 480]
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
        }
    ]
};