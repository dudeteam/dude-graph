var DUDE_MODELS = {

    // operators

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
    "subtract": {
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

    // delegates

    "on_start": {
        "cgType": "Delegate"
    },
    "on_update": {
        "cgType": "Delegate"
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

    // utilities

    "info": {
        "cgType": "Instruction",
        "cgInputs": [
            {
                "cgType": "Point",
                "cgName": "message",
                "cgValueType": "String"
            }
        ]
    },
    "to_string": {
        "cgType": "Function",
        "cgTemplates": ["Number", "Boolean", "String", "Entity"],
        "cgInputs": [
            {
                "cgType": "Point",
                "cgName": "data",
                "cgValueType": "Number",
                "cgTemplate": "TValue"
            }
        ],
        "cgReturn": {
            "cgType": "Point",
            "cgValueType": "String"
        }
    },

    // system/Timer

    "Timer.start": {
        "cgType": "Instruction",
        "cgInputs": [
            {
                "cgType": "Point",
                "cgName": "this",
                "cgValueType": "Timer"
            }
        ]
    },
    "Timer.pause": {
        "cgType": "Instruction",
        "cgInputs": [
            {
                "cgType": "Point",
                "cgName": "this",
                "cgValueType": "Timer"
            }
        ]
    },
    "Timer.resume": {
        "cgType": "Instruction",
        "cgInputs": [
            {
                "cgType": "Point",
                "cgName": "this",
                "cgValueType": "Timer"
            }
        ]
    },
    "Timer.tick": {
        "cgType": "Instruction",
        "cgInputs": [
            {
                "cgType": "Point",
                "cgName": "this",
                "cgValueType": "Timer"
            }
        ]
    },
    "Timer.fps": {
        "cgType": "Getter",
        "cgClassType": "Timer",
        "cgValueType": "Number"
    },
    "Timer.elapsed_time": {
        "cgType": "Getter",
        "cgClassType": "Timer",
        "cgValueType": "Number"
    },
    "Timer.delta_time": {
        "cgType": "Getter",
        "cgClassType": "Timer",
        "cgValueType": "Number"
    },

    // objects/Entity

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