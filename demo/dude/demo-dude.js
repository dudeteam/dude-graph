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
                    "singleConnection": true,
                    "cgValue": {
                        "choice": "X",
                        "choices": [
                            "A",
                            "B",
                            "X",
                            "Y",
                            "Joystick 1",
                            "Joystick 2"
                        ]
                    }
                }
            ],
            "cgOutputs": [
                {
                    "cgType": "Stream",
                    "cgName": "out",
                    "cgValueType": "Stream",
                    "singleConnection": true
                },
                {
                    "cgType": "Point",
                    "cgName": "key_name",
                    "cgValueType": "String",
                    "singleConnection": true
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
                    "cgName": "in",
                    "cgValueType": "Stream",
                    "singleConnection": true,
                    "cgValue": null
                },
                {
                    "cgType": "Point",
                    "cgName": "test",
                    "cgValueType": "Boolean",
                    "singleConnection": true,
                    "cgValue": null
                }
            ],
            "cgOutputs": [
                {
                    "cgType": "Stream",
                    "cgName": "true",
                    "cgValueType": "Stream",
                    "singleConnection": true
                },
                {
                    "cgType": "Stream",
                    "cgName": "false",
                    "cgValueType": "Stream",
                    "singleConnection": true
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
                    "cgValueType": "Number",
                    "singleConnection": true,
                    "cgValue": null
                },
                {
                    "cgType": "Point",
                    "cgName": "second",
                    "cgValueType": "Number",
                    "singleConnection": true,
                    "cgValue": "0"
                }
            ],
            "cgOutputs": [
                {
                    "cgType": "Point",
                    "cgName": "value",
                    "cgValueType": "Boolean",
                    "singleConnection": true
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
                    "cgName": "in",
                    "cgValueType": "Stream",
                    "singleConnection": true,
                    "cgValue": null
                },
                {
                    "cgType": "Point",
                    "cgName": "this",
                    "cgValueType": "Entity",
                    "singleConnection": true,
                    "cgValue": null
                },
                {
                    "cgType": "Point",
                    "cgName": "name",
                    "cgValueType": "String",
                    "singleConnection": true,
                    "cgValue": null
                }
            ],
            "cgOutputs": [
                {
                    "cgType": "Stream",
                    "cgName": "out",
                    "cgValueType": "Stream",
                    "singleConnection": true
                },
                {
                    "cgType": "Point",
                    "cgName": "value",
                    "cgValueType": "Number",
                    "singleConnection": true
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
            "cgInputs": [],
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
            "cgInputs": [],
            "cgOutputs": [
                {
                    "cgType": "Stream",
                    "cgName": "out",
                    "cgValueType": "Stream",
                    "singleConnection": true
                }
            ]
        },
        {
            "cgType": "Assignation",
            "cgId": "9",
            "cgName": "Assignation",
            "cgInputs": [
                {
                    "cgType": "Stream",
                    "cgName": "in",
                    "cgValueType": "Stream",
                    "singleConnection": true,
                    "cgValue": null
                },
                {
                    "cgType": "Point",
                    "cgName": "this",
                    "cgValueType": "Number",
                    "singleConnection": true,
                    "cgValue": null
                },
                {
                    "cgType": "Point",
                    "cgName": "other",
                    "cgValueType": "Number",
                    "singleConnection": true,
                    "cgValue": null
                }
            ],
            "cgOutputs": [
                {
                    "cgType": "Stream",
                    "cgName": "out",
                    "cgValueType": "Stream",
                    "singleConnection": true
                }
            ]
        },
        {
            "cgType": "Operator",
            "cgId": "13",
            "cgName": "subtract",
            "cgInputs": [
                {
                    "cgType": "Point",
                    "cgName": "first",
                    "cgValueType": "Number",
                    "singleConnection": true,
                    "cgValue": null
                },
                {
                    "cgType": "Point",
                    "cgName": "second",
                    "cgValueType": "Number",
                    "singleConnection": true,
                    "cgValue": "1"
                }
            ],
            "cgOutputs": [
                {
                    "cgType": "Point",
                    "cgName": "value",
                    "cgValueType": "Number",
                    "singleConnection": true
                }
            ]
        },
        {
            "cgType": "Assignation",
            "cgId": "14",
            "cgName": "Assignation",
            "cgInputs": [
                {
                    "cgType": "Stream",
                    "cgName": "in",
                    "cgValueType": "Stream",
                    "singleConnection": true,
                    "cgValue": null
                },
                {
                    "cgType": "Point",
                    "cgName": "this",
                    "cgValueType": "Number",
                    "singleConnection": true,
                    "cgValue": null
                },
                {
                    "cgType": "Point",
                    "cgName": "other",
                    "cgValueType": "Number",
                    "singleConnection": true,
                    "cgValue": null
                }
            ],
            "cgOutputs": [
                {
                    "cgType": "Stream",
                    "cgName": "out",
                    "cgValueType": "Stream",
                    "singleConnection": true
                }
            ]
        }
    ],
    "connections": [
        {
            "cgOutputName": "out",
            "cgOutputBlockId": "0",
            "cgInputName": "in",
            "cgInputBlockId": "1"
        },
        {
            "cgOutputName": "value",
            "cgOutputBlockId": "2",
            "cgInputName": "test",
            "cgInputBlockId": "1"
        },
        {
            "cgOutputName": "value",
            "cgOutputBlockId": "4",
            "cgInputName": "first",
            "cgInputBlockId": "2"
        },
        {
            "cgOutputName": "value",
            "cgOutputBlockId": "4",
            "cgInputName": "this",
            "cgInputBlockId": "9"
        },
        {
            "cgOutputName": "value",
            "cgOutputBlockId": "4",
            "cgInputName": "this",
            "cgInputBlockId": "14"
        },
        {
            "cgOutputName": "true",
            "cgOutputBlockId": "1",
            "cgInputName": "in",
            "cgInputBlockId": "3"
        },
        {
            "cgOutputName": "value",
            "cgOutputBlockId": "6",
            "cgInputName": "this",
            "cgInputBlockId": "3"
        },
        {
            "cgOutputName": "value",
            "cgOutputBlockId": "13",
            "cgInputName": "other",
            "cgInputBlockId": "14"
        },
        {
            "cgOutputName": "out",
            "cgOutputBlockId": "3",
            "cgInputName": "in",
            "cgInputBlockId": "14"
        },
        {
            "cgOutputName": "out",
            "cgOutputBlockId": "8",
            "cgInputName": "in",
            "cgInputBlockId": "9"
        },
        {
            "cgOutputName": "value",
            "cgOutputBlockId": "4",
            "cgInputName": "first",
            "cgInputBlockId": "13"
        }
    ]
};
var DEMO_DUDE_RENDERER_DATA = {
    "zoom": {
        "translate": [
            -426.98826959773396,
            -227.66433077374484
        ],
        "scale": 1.321637272536195
    },
    "blocks": [
        {
            "id": "0",
            "cgBlock": "0",
            "description": "on_key_down",
            "position": [
                451.13592529296875,
                525.4194030761719
            ],
            "parent": "0"
        },
        {
            "id": "1",
            "cgBlock": "1",
            "description": "Condition",
            "position": [
                664.120849609375,
                524.3040466308594
            ],
            "parent": "0"
        },
        {
            "id": "2",
            "cgBlock": "2",
            "description": "greater_than",
            "position": [
                664.120849609375,
                624.3040466308594
            ],
            "parent": "0"
        },
        {
            "id": "3",
            "cgBlock": "3",
            "description": "Entity.add_entity",
            "position": [
                871.7590942382812,
                539.1682434082031
            ],
            "parent": "0"
        },
        {
            "id": "4",
            "cgBlock": "4",
            "description": "nb_bullets",
            "position": [
                664.120849609375,
                722.0513000488281
            ],
            "parent": "0"
        },
        {
            "id": "6",
            "cgBlock": "6",
            "description": "entity",
            "position": [
                872.6198120117188,
                658.6371154785156
            ],
            "parent": "0"
        },
        {
            "id": "8",
            "cgBlock": "8",
            "description": "on_start",
            "position": [
                453.611572265625,
                251.68630981445312
            ],
            "parent": "1"
        },
        {
            "id": "9",
            "cgBlock": "9",
            "description": "Assignation",
            "position": [
                653.611572265625,
                251.68630981445312
            ],
            "parent": "1"
        },
        {
            "id": "10",
            "cgBlock": "4",
            "description": "nb_bullets",
            "position": [
                651.8899536132812,
                372.0159606933594
            ],
            "parent": "1"
        },
        {
            "id": "15",
            "cgBlock": "13",
            "description": "subtract",
            "position": [
                1124.5478515625,
                666.2245330810547
            ],
            "parent": "0",
            "inputs": {
                "second": {
                    "hidden": true
                }
            }
        },
        {
            "id": "16",
            "cgBlock": "14",
            "description": "Assignation",
            "position": [
                1126.7542724609375,
                488.2637634277344
            ],
            "parent": "0"
        },
        {
            "id": "17",
            "cgBlock": "4",
            "description": "nb_bullets",
            "position": [
                1125.990478515625,
                610.4848937988281
            ],
            "parent": "0"
        },
        {
            "id": "18",
            "cgBlock": "4",
            "description": "nb_bullets",
            "position": [
                1125.0326538085938,
                766.3722229003906
            ],
            "parent": "0"
        }
    ],
    "groups": [
        {
            "id": "0",
            "description": "Shoots if enough bullets",
            "position": [
                441.13592529296875,
                448.2637634277344
            ]
        },
        {
            "id": "1",
            "description": "Initializes the number of bullets",
            "position": [
                443.611572265625,
                211.68630981445312
            ]
        }
    ],
    "connections": [
        {
            "cgConnectionIndex": 0,
            "outputName": "out",
            "outputRendererBlockId": "0",
            "inputName": "in",
            "inputRendererBlockId": "1"
        },
        {
            "cgConnectionIndex": 1,
            "outputName": "value",
            "outputRendererBlockId": "2",
            "inputName": "test",
            "inputRendererBlockId": "1"
        },
        {
            "cgConnectionIndex": 2,
            "outputName": "value",
            "outputRendererBlockId": "4",
            "inputName": "first",
            "inputRendererBlockId": "2"
        },
        {
            "cgConnectionIndex": 3,
            "outputName": "value",
            "outputRendererBlockId": "10",
            "inputName": "this",
            "inputRendererBlockId": "9"
        },
        {
            "cgConnectionIndex": 4,
            "outputName": "value",
            "outputRendererBlockId": "17",
            "inputName": "this",
            "inputRendererBlockId": "16"
        },
        {
            "cgConnectionIndex": 5,
            "outputName": "true",
            "outputRendererBlockId": "1",
            "inputName": "in",
            "inputRendererBlockId": "3"
        },
        {
            "cgConnectionIndex": 6,
            "outputName": "value",
            "outputRendererBlockId": "6",
            "inputName": "this",
            "inputRendererBlockId": "3"
        },
        {
            "cgConnectionIndex": 7,
            "outputName": "value",
            "outputRendererBlockId": "15",
            "inputName": "other",
            "inputRendererBlockId": "16"
        },
        {
            "cgConnectionIndex": 8,
            "outputName": "out",
            "outputRendererBlockId": "3",
            "inputName": "in",
            "inputRendererBlockId": "16"
        },
        {
            "cgConnectionIndex": 9,
            "outputName": "out",
            "outputRendererBlockId": "8",
            "inputName": "in",
            "inputRendererBlockId": "9"
        },
        {
            "cgConnectionIndex": 10,
            "outputName": "value",
            "outputRendererBlockId": "18",
            "inputName": "first",
            "inputRendererBlockId": "15"
        }
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