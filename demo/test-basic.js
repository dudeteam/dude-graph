var TEST_BASIC_GRAPH_DATA = {
    "blocks": [
        {
            "cgId": "0",
            "cgName": "Process number",
            "cgInputs": [
                {
                    "cgType": "Point",
                    "cgName": "in",
                    "cgValueType": "Number"
                }
            ]
        },
        {
            "cgId": "1",
            "cgName": "Get number",
            "cgOutputs": [
                {
                    "cgType": "Point",
                    "cgName": "out",
                    "cgValueType": "Number"
                }
            ]
        },
        {
            "cgId": "2",
            "cgOutputs": [
                {
                    "cgType": "Point",
                    "cgName": "out",
                    "cgValueType": "Number"
                }
            ]
        },
        {"cgId": "3", "cgModel": "Entity.add_entity"},
        {"cgId": "4", "cgType": "Variable", "cgValueType": "Number", "cgName": "size", "cgValue": 5},
        {"cgId": "5", "cgModel": "Entity.name"},
        {"cgId": "6", "cgModel": "add"}
    ],
    "connections": [
        {"cgOutputBlockId": "1", "cgOutputName": "out", "cgInputBlockId": "0", "cgInputName": "in"}
    ]
};
var TEST_BASIC_RENDERER_DATA = {
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
            "description": "Something interesting",
            "position": [10, 20]
        },
        {
            "id": "Koala",
            "type": "group",
            "description": "Child",
            "position": [10, 20],
            "parent": "0"
        }
    ],
    "blocks": [
        {
            "id": "0",
            "type": "block",
            "position": [120, 40],
            "parent": "0"
        },
        {
            "id": "1",
            "type": "block",
            "position": [240, 240],
            "parent": "Koala"
        },
        {
            "id": "2",
            "type": "block",
            "position": [400, 240],
            "parent": "Koala"
        },
        {
            "id": "3",
            "type": "block",
            "position": [600, 600]
        },
        {
            "id": "4",
            "type": "block",
            "position": [100, 500]
        },
        {
            "id": "5",
            "type": "block",
            "position": [200, 400]
        },
        {
            "id": "6",
            "type": "block",
            "position": [300, 300]
        }
    ]
};