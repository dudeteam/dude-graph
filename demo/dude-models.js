var DUDE_MODELS = {

    // Operators

    "greater_than": {
        "cgType": "Operator",
        "cgTemplates": {
            "TValue": ["Number", "Vec2", "Vec3", "Vec4"]
        },
        "cgInputs": [
            {
                "cgType": "Point",
                "cgTemplate": "TValue",
                "cgValueType": "Number",
                "cgName": "first"
            },
            {
                "cgType": "Point",
                "cgTemplate": "TValue",
                "cgValueType": "Number",
                "cgName": "second"
            }
        ],
        "cgReturn": {"cgValueType": "Boolean"}
    },
    "add": {
        "cgType": "Operator",
        "cgTemplates": {
            "TValue": ["Number", "Vec2", "Vec3", "Vec4"]
        },
        "cgInputs": [
            {
                "cgType": "Point",
                "cgTemplate": "TValue",
                "cgValueType": "Number",
                "cgName": "first"
            },
            {
                "cgType": "Point",
                "cgTemplate": "TValue",
                "cgValueType": "Number",
                "cgName": "second"
            }
        ],
        "cgReturn": {"cgValueType": "Number", "cgTemplate": "TValue"}
    },
    "substract": {
        "cgType": "Operator",
        "cgTemplates": {
            "TValue": ["Number", "Vec2", "Vec3", "Vec4"]
        },
        "cgInputs": [
            {
                "cgType": "Point",
                "cgTemplate": "TValue",
                "cgValueType": "Number",
                "cgName": "first"
            },
            {
                "cgType": "Point",
                "cgTemplate": "TValue",
                "cgValueType": "Number",
                "cgName": "second"
            }
        ],
        "cgReturn": {"cgValueType": "Number", "cgTemplate": "TValue"}
    },
    "multiply": {
        "cgType": "Operator",
        "cgTemplates": {
            "TValue": ["Number", "Vec2", "Vec3", "Vec4"]
        },
        "cgInputs": [
            {
                "cgType": "Point",
                "cgTemplate": "TValue",
                "cgValueType": "Number",
                "cgName": "first"
            },
            {
                "cgType": "Point",
                "cgTemplate": "TValue",
                "cgValueType": "Number",
                "cgName": "second"
            }
        ],
        "cgReturn": {"cgValueType": "Number", "cgTemplate": "TValue"}
    },
    "divide": {
        "cgType": "Operator",
        "cgTemplates": {
            "TValue": ["Number", "Vec2", "Vec3", "Vec4"]
        },
        "cgInputs": [
            {
                "cgType": "Point",
                "cgTemplate": "TValue",
                "cgValueType": "Number",
                "cgName": "first"
            },
            {
                "cgType": "Point",
                "cgTemplate": "TValue",
                "cgValueType": "Number",
                "cgName": "second"
            }
        ],
        "cgReturn": {"cgValueType": "Number", "cgTemplate": "TValue"}
    },

    // Delegates

    "on_start": {
        "cgType": "Delegate"
    },
    "on_update": {
        "cgType": "Delegate",
        "cgOutputs": [
            {
                "cgType": "Point",
                "cgName": "delta_time",
                "cgValueType": "Number"
            }
        ]
    },
    "on_destroy": {
        "cgType": "Delegate"
    },
    "on_key_down": {
        "cgType": "Delegate",
        "cgOutputs": [
            {
                "cgType": "Point",
                "cgName": "key_name",
                "cgValueType": "String"
            }
        ]
    },

    // Methods/Entity

    "Entity.destroy": {
        "cgType": "Instruction",
        "cgInputs": [
            {
                "cgType": "Point",
                "cgName": "this",
                "cgValueType": "Entity"
            }
        ]
    },
    "Entity.add_entity": {
        "cgType": "Instruction",
        "cgInputs": [
            {
                "cgType": "Point",
                "cgName": "this",
                "cgValueType": "Entity"
            },
            {
                "cgType": "Point",
                "cgName": "name",
                "cgValueType": "String"
            }
        ],
        "cgReturn": {"cgValueType": "Entity"}
    },
    "Entity.has_behavior": {
        "cgType": "Function",
        "cgInputs": [
            {
                "cgType": "Point",
                "cgName": "this",
                "cgValueType": "Entity"
            },
            {
                "cgType": "Point",
                "cgName": "name",
                "cgValueType": "String"
            }
        ],
        "cgReturn": {"cgValueType": "Boolean"}
    },
    "Entity.add_behavior": {
        "cgType": "Instruction",
        "cgInputs": [
            {
                "cgType": "Point",
                "cgName": "this",
                "cgValueType": "Entity"
            },
            {
                "cgType": "Point",
                "cgName": "name",
                "cgValueType": "String"
            }
        ],
        "cgReturn": {"cgValueType": "Behavior"}
    },
    "Entity.behavior": {
        "cgType": "Instruction",
        "cgInputs": [
            {
                "cgType": "Point",
                "cgName": "this",
                "cgValueType": "Entity"
            },
            {
                "cgType": "Point",
                "cgName": "name",
                "cgValueType": "String"
            }
        ],
        "cgReturn": {"cgValueType": "Behavior"}
    },
    "Entity.name": {
        "cgType": "Getter",
        "cgClassType": "Entity",
        "cgValueType": "String"
    },
    "Entity.parent": {
        "cgType": "Getter",
        "cgClassType": "Entity",
        "cgValueType": "Entity"
    }
};