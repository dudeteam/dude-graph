var DEMO_DUDE_GRAPH_DATA = {
    "blocks": [
        {
            "cgType": "Delegate",
            "cgId": "0",
            "cgName": "on_key_down",
            "cgInputs": [
                {
                    "cgType": "Choice",
                    "cgName": "key",
                    "cgValueType": "Choice",
                    "cgValue": {
                        "choice": "X",
                        "choices": ["A", "B", "X", "Y", "Joystick 1", "Joystick 2"]
                    }
                }
            ],
            "cgOutputs": [
                {
                    "cgType": "Stream",
                    "cgName": "out"
                },
                {
                    "cgType": "Point",
                    "cgName": "key_name",
                    "cgValueType": "String"
                }
            ]
        },
        {
            "cgType": "Condition",
            "cgId": "1",
            "cgName": "Condition",
            "cgInputs": [
                {
                    "cgType": "Stream",
                    "cgName": "in"
                },
                {
                    "cgType": "Point",
                    "cgName": "test",
                    "cgValueType": "Boolean"
                }
            ],
            "cgOutputs": [
                {
                    "cgType": "Stream",
                    "cgName": "true"
                },
                {
                    "cgType": "Stream",
                    "cgName": "false"
                }
            ]
        },
        {
            "cgType": "Operator",
            "cgId": "2",
            "cgName": "greater_than",
            "cgInputs": [
                {
                    "cgType": "Point",
                    "cgName": "first",
                    "cgValueType": "Number"
                },
                {
                    "cgType": "Point",
                    "cgName": "second",
                    "cgValueType": "Number"
                }
            ],
            "cgOutputs": [
                {
                    "cgType": "Point",
                    "cgName": "value",
                    "cgValueType": "Boolean"
                }
            ]
        },
        {
            "cgType": "Instruction",
            "cgId": "3",
            "cgName": "Entity.add_entity",
            "cgInputs": [
                {
                    "cgType": "Stream",
                    "cgName": "in"
                },
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
            "cgOutputs": [
                {
                    "cgType": "Stream",
                    "cgName": "out"
                },
                {
                    "cgType": "Point",
                    "cgName": "value",
                    "cgValueType": "Number"
                }
            ]
        },
        {
            "cgType": "Variable",
            "cgId": "4",
            "cgName": "nb_bullets",
            "cgInputs": [],
            "cgOutputs": [
                {
                    "cgType": "Point",
                    "cgName": "value",
                    "cgValueType": "Number",
                    "singleConnection": false
                }
            ]
        },
        {
            "cgType": "Variable",
            "cgId": "6",
            "cgName": "entity",
            "cgOutputs": [
                {
                    "cgType": "Point",
                    "cgName": "value",
                    "cgValueType": "Entity",
                    "singleConnection": false
                }
            ]
        },
        {
            "cgType": "Delegate",
            "cgId": "8",
            "cgName": "on_start",
            "cgOutputs": [
                {
                    "cgType": "Stream",
                    "cgName": "out"
                }
            ]
        },
        {
            "cgType": "Assignation",
            "cgId": "9",
            "cgName": "Assignation",
            "cgTemplates": {},
            "cgInputs": [
                {
                    "cgType": "Stream",
                    "cgName": "in"
                },
                {
                    "cgType": "Point",
                    "cgName": "this",
                    "cgValueType": "Number"
                },
                {
                    "cgType": "Point",
                    "cgName": "other",
                    "cgValueType": "Number"
                }
            ],
            "cgOutputs": [
                {
                    "cgType": "Stream",
                    "cgName": "out"
                }
            ]
        },
        {
            "cgType": "Delegate",
            "cgId": "10",
            "cgName": "on_update",
            "cgOutputs": [
                {
                    "cgType": "Stream",
                    "cgName": "out"
                }
            ]
        },
        {
            "cgType": "Instruction",
            "cgId": "11",
            "cgName": "info",
            "cgTemplates": {},
            "cgInputs": [
                {
                    "cgType": "Stream",
                    "cgName": "in"
                },
                {
                    "cgType": "Point",
                    "cgName": "message",
                    "cgValueType": "String"
                }
            ],
            "cgOutputs": [
                {
                    "cgType": "Stream",
                    "cgName": "out"
                }
            ]
        },
        {
            "cgType": "Function",
            "cgId": "12",
            "cgName": "to_string",
            "cgTemplates": [
                "Number",
                "Boolean",
                "String",
                "Entity"
            ],
            "cgInputs": [
                {
                    "cgType": "Point",
                    "cgName": "data",
                    "cgValueType": "Number"
                }
            ],
            "cgReturn": {
                "cgType": "Point",
                "cgName": "value",
                "cgValueType": "String"
            }
        },
        {
            "cgType": "Operator",
            "cgId": "13",
            "cgName": "subtract",
            "cgTemplates": {},
            "cgInputs": [
                {
                    "cgType": "Point",
                    "cgName": "first",
                    "cgValueType": "Number"
                },
                {
                    "cgType": "Point",
                    "cgName": "second",
                    "cgValueType": "Number"
                }
            ],
            "cgOutputs": [
                {
                    "cgType": "Point",
                    "cgName": "value",
                    "cgValueType": "Number"
                }
            ]
        },
        {
            "cgType": "Assignation",
            "cgId": "14",
            "cgName": "Assignation",
            "cgTemplates": {},
            "cgInputs": [
                {
                    "cgType": "Stream",
                    "cgName": "in"
                },
                {
                    "cgType": "Point",
                    "cgName": "this",
                    "cgValueType": "Number"
                },
                {
                    "cgType": "Point",
                    "cgName": "other",
                    "cgValueType": "Number"
                }
            ],
            "cgOutputs": [
                {
                    "cgType": "Stream",
                    "cgName": "out"
                }
            ]
        }
    ],
    "connections": [
        {"cgOutputName": "out", "cgOutputBlockId": "0", "cgInputName": "in", "cgInputBlockId": "1"},
        {"cgOutputName": "value", "cgOutputBlockId": "2", "cgInputName": "test", "cgInputBlockId": "1"},
        {"cgOutputName": "value", "cgOutputBlockId": "4", "cgInputName": "first", "cgInputBlockId": "2"},
        {"cgOutputName": "value", "cgOutputBlockId": "4", "cgInputName": "this", "cgInputBlockId": "9"},
        {"cgOutputName": "value", "cgOutputBlockId": "4", "cgInputName": "this", "cgInputBlockId": "14"},
        {"cgOutputName": "true", "cgOutputBlockId": "1", "cgInputName": "in", "cgInputBlockId": "3"},
        {"cgOutputName": "value", "cgOutputBlockId": "6", "cgInputName": "this", "cgInputBlockId": "3"}
    ]
};
var DEMO_DUDE_RENDERER_DATA = {
    "config": {
        "zoom": {
            "translate": [0, 0],
            "scale": 1
        }
    },
    "blocks": [
        {
            "id": "0",
            "cgBlock": "0",
            "position": [
                100,
                100
            ],
            "parent": "0"
        },
        {
            "id": "1",
            "cgBlock": "1",
            "position": [
                300,
                50
            ],
            "parent": "0"
        },
        {
            "id": "2",
            "cgBlock": "2",
            "position": [
                300,
                150
            ],
            "parent": "0"
        },
        {
            "id": "3",
            "cgBlock": "3",
            "position": [
                500,
                100
            ],
            "parent": "0"
        },
        {
            "id": "4",
            "cgBlock": "4",
            "position": [
                300,
                240
            ],
            "parent": "0"
        },
        {
            "id": "6",
            "cgBlock": "6",
            "position": [
                500,
                210
            ],
            "parent": "0"
        },
        {
            "id": "8",
            "cgBlock": "8",
            "position": [
                100,
                500
            ],
            "parent": "1"
        },
        {
            "id": "9",
            "cgBlock": "9",
            "position": [
                300,
                500
            ],
            "parent": "1"
        },
        {
            "id": "10",
            "cgBlock": "4",
            "position": [
                300,
                610
            ],
            "parent": "1"
        },
        {
            "id": "12",
            "cgBlock": "10",
            "position": [
                500,
                500
            ],
            "parent": "2"
        },
        {
            "id": "13",
            "cgBlock": "11",
            "position": [
                700,
                500
            ],
            "parent": "2"
        },
        {
            "id": "14",
            "cgBlock": "12",
            "position": [
                700,
                600
            ],
            "parent": "2"
        },
        {
            "id": "15",
            "cgBlock": "13",
            "position": [
                700,
                220
            ],
            "inputs": {
                "second": {
                    "hidden": true
                }
            },
            "parent": "0"
        },
        {
            "id": "16",
            "cgBlock": "14",
            "position": [
                700,
                30
            ],
            "parent": "0"
        },
        {
            "id": "17",
            "cgBlock": "4",
            "position": [
                700,
                140
            ],
            "parent": "0"
        },
        {
            "id": "18",
            "cgBlock": "4",
            "position": [
                700,
                310
            ],
            "parent": "0"
        }
    ],
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
    "connections": [
        {"cgConnectionIndex": 0, "outputRendererBlockId": "0", "inputRendererBlockId": "1"},
        {"cgConnectionIndex": 1, "outputRendererBlockId": "2", "inputRendererBlockId": "1"},
        {"cgConnectionIndex": 2, "outputRendererBlockId": "4", "inputRendererBlockId": "2"},
        {"cgConnectionIndex": 3, "outputRendererBlockId": "10", "inputRendererBlockId": "9"},
        {"cgConnectionIndex": 4, "outputRendererBlockId": "17", "inputRendererBlockId": "16"},
        {"cgConnectionIndex": 5, "outputRendererBlockId": "1", "inputRendererBlockId": "3"},
        {"cgConnectionIndex": 6, "outputRendererBlockId": "6", "inputRendererBlockId": "3"}
    ]
};
var DEMO_DUDE_MODEL_DATA = [
    {
        "item": {
            "name": "Entity.add_entity",
            "icon": "fa fa-plus-square",
            "data": {
                "cgType": "Instruction",
                "cgName": "Entity.add_entity",
                "cgInputs": [
                    {
                        "cgType": "Stream",
                        "cgName": "in"
                    },
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
                "cgOutputs": [
                    {
                        "cgType": "Stream",
                        "cgName": "out"
                    }
                ]
            }
        }
    },
    {
        "item": {
            "name": "Printf",
            "icon": "fa fa-plus-square",
            "data": {
                "cgType": "Expression",
                "cgName": "Printf",
                "cgInputs": [
                    {
                        "cgType": "Point",
                        "cgName": "format",
                        "cgValueType": "String"
                    }
                ],
                "cgOutputs": [
                    {
                        "cgType": "Point",
                        "cgName": "value",
                        "cgValueType": "String"
                    }
                ]
            }
        }
    },
    {
        "item": {
            "name": "Merged Points Bug",
            "icon": "fa fa-bug",
            "data": {
                "cgType": "Instruction",
                "cgName": "Merged Points Bug",
                "cgInputs": [
                    {
                        "cgType": "Stream",
                        "cgName": "in"
                    },
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
                "cgOutputs": [
                    {
                        "cgType": "Stream",
                        "cgName": "in"
                    },
                    {
                        "cgType": "Stream",
                        "cgName": "out"
                    }
                ]
            }
        }
    },
    {
        "group": {
            "name": "Control",
            "items": [
                {
                    "item": {
                        "name": "Condition",
                        "icon": "fa fa-share-alt",
                        "data": {
                            "cgType": "Condition",
                            "cgName": "Condition",
                            "cgInputs": [
                                {
                                    "cgType": "Stream",
                                    "cgName": "in"
                                },
                                {
                                    "cgType": "Point",
                                    "cgName": "test",
                                    "cgValueType": "Boolean"
                                }
                            ],
                            "cgOutputs": [
                                {
                                    "cgType": "Stream",
                                    "cgName": "true"
                                },
                                {
                                    "cgType": "Stream",
                                    "cgName": "false"
                                }
                            ]
                        }
                    }
                }
            ]
        }
    }
];