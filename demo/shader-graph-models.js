var SHADER_GRAPH_MODELS = {
    "material_output": {
        "cgType": "Function",
        "cgInputs": [
            {
                "cgType": "Point",
                "cgName": "vertex",
                "cgValueType": "Vec3"
            },
            {
                "cgType": "Point",
                "cgName": "color",
                "cgValueType": "Color"
            }
        ]
    },
    "checker": {
        "cgType": "Function",
        "cgInputs": [],
        "cgReturn": {"cgValueType": "Color"}
    },
    "black_and_white": {
        "cgType": "Function",
        "cgInputs": [
            {
                "cgType": "Point",
                "cgName": "color",
                "cgValueType": "Color"
            }
        ],
        "cgReturn": {"cgValueType": "Color"}
    },
    "sprite": {
        "cgType": "Function",
        "cgInputs": [
            {
                "cgType": "Point",
                "cgName": "texture",
                "cgValueType": "Image"
            },
            {
                "cgType": "Point",
                "cgName": "color",
                "cgValueType": "Color"
            }
        ],
        "cgReturn": {"cgValueType": "Color"}
    },
    "mix": {
        "cgType": "Function",
        "cgTemplates": {
            "genType": ["Number", "Vec2", "Vec3", "Vec4", "Color"]
        },
        "cgInputs": [
            {
                "cgType": "Point",
                "cgName": "x",
                "cgTemplate": "genType",
                "cgValueType": "Number"
            },
            {
                "cgType": "Point",
                "cgName": "y",
                "cgTemplate": "genType",
                "cgValueType": "Number"
            },
            {
                "cgType": "Point",
                "cgName": "a",
                "cgValueType": "Number"
            }
        ],
        "cgReturn": {"cgValueType": "Number", "cgTemplate": "genType"}
    }
};