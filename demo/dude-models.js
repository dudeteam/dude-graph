var DUDE_MODELS = {

    // globals
    "entity": {
        "cgType": "Variable",
        "cgValueType": "Entity",
        "cgFolder": "globals"
    },
    "game": {
        "cgType": "Variable",
        "cgValueType": "Game",
        "cgFolder": "globals"
    },

    // operators

    "greater_than": {
        "cgType": "Operator",
        "cgFolder": "operators",
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
        "cgFolder": "operators",
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
        "cgFolder": "operators",
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
        "cgFolder": "operators",
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
        "cgFolder": "operators",
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
        "cgType": "Delegate",
        "cgFolder": "delegates"
    },
    "on_update": {
        "cgType": "Delegate",
        "cgFolder": "delegates"
    },
    "on_destroy": {
        "cgType": "Delegate",
        "cgFolder": "delegates"
    },
    "on_key_down": {
        "cgType": "Delegate",
        "cgFolder": "delegates",
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
        "cgFolder": "utilities",
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
        "cgFolder": "utilities",
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
        "cgFolder": "system",
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
        "cgFolder": "system",
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
        "cgFolder": "system",
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
        "cgFolder": "system",
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
        "cgFolder": "system",
        "cgClassType": "Timer",
        "cgValueType": "Number"
    },
    "Timer.elapsed_time": {
        "cgType": "Getter",
        "cgFolder": "system",
        "cgClassType": "Timer",
        "cgValueType": "Number"
    },
    "Timer.delta_time": {
        "cgType": "Getter",
        "cgFolder": "system",
        "cgClassType": "Timer",
        "cgValueType": "Number"
    },

    // objects/Entity

    "Entity.destroy": {
        "cgType": "Instruction",
        "cgFolder": "objects",
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
        "cgFolder": "objects",
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
        "cgFolder": "objects",
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
        "cgFolder": "objects",
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
        "cgFolder": "objects",
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
        "cgFolder": "objects",
        "cgClassType": "Entity",
        "cgValueType": "String"
    },
    "Entity.parent": {
        "cgType": "Getter",
        "cgFolder": "objects",
        "cgClassType": "Entity",
        "cgValueType": "Entity"
    }

};