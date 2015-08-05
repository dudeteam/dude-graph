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
        }
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
            "description": "Shoots if enough bullets",
            "position": [50, 50]
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
        }
    ]
};