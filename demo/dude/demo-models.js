var DEMO_DUDE_MODEL_DATA = [
    {
        "group": {
            "name": "Variables",
            "items": [
                {
                    "item": {
                        "name": "player",
                        "icon": "fa fa-circle",
                        "data": {
                            "blockType": "Variable",
                            "blockValueType": "Object",
                            "blockValue": "player",
                            "blockName": "player",
                            "blockInputs": [],
                            "blockOutputs": [
                                {
                                    "pointType": "Point",
                                    "pointValueType": "Object",
                                    "pointName": "value"
                                }
                            ]
                        }
                    }
                }
            ]
        }
    },
    {
        "group": {
            "name": "Delegates",
            "items": [
                {
                    "item": {
                        "name": "on_start",
                        "icon": "fa fa-play",
                        "data": {
                            "blockType": "Delegate",
                            "blockName": "on_start",
                            "blockInputs": [
                            ],
                            "blockOutputs": [
                                {
                                    "pointType": "Stream",
                                    "pointName": "out"
                                }
                            ]
                        }
                    }
                },
                {
                    "item": {
                        "name": "on_update",
                        "icon": "fa fa-play",
                        "data": {
                            "blockType": "Delegate",
                            "blockName": "on_update",
                            "blockInputs": [
                            ],
                            "blockOutputs": [
                                {
                                    "pointType": "Stream",
                                    "pointName": "out"
                                }
                            ]
                        }
                    }
                },
                {
                    "item": {
                        "name": "on_stop",
                        "icon": "fa fa-play",
                        "data": {
                            "blockType": "Delegate",
                            "blockName": "on_stop",
                            "blockInputs": [
                            ],
                            "blockOutputs": [
                                {
                                    "pointType": "Stream",
                                    "pointName": "out"
                                }
                            ]
                        }
                    }
                },
                {
                    "item": {
                        "name": "on_key_down",
                        "icon": "fa fa-play",
                        "data": {
                            "blockType": "Delegate",
                            "blockName": "on_key_down",
                            "blockInputs": [
                            ],
                            "blockOutputs": [
                                {
                                    "pointType": "Stream",
                                    "pointName": "out"
                                },
                                {
                                    "pointType": "Point",
                                    "pointValueType": "Choice",
                                    "pointName": "key"
                                }
                            ]
                        }
                    }
                },
                {
                    "item": {
                        "name": "on_key_up",
                        "icon": "fa fa-play",
                        "data": {
                            "blockType": "Delegate",
                            "blockName": "on_key_down",
                            "blockInputs": [
                            ],
                            "blockOutputs": [
                                {
                                    "pointType": "Stream",
                                    "pointName": "out"
                                },
                                {
                                    "pointType": "Point",
                                    "pointValueType": "Choice",
                                    "pointName": "key"
                                }
                            ]
                        }
                    }
                },
                {
                    "item": {
                        "name": "on_key",
                        "icon": "fa fa-play",
                        "data": {
                            "blockType": "Delegate",
                            "blockName": "on_key_down",
                            "blockInputs": [
                            ],
                            "cgOutputs": [
                                {
                                    "pointType": "Stream",
                                    "pointName": "out"
                                },
                                {
                                    "pointType": "Point",
                                    "pointValueType": "Choice",
                                    "pointName": "key"
                                }
                            ]
                        }
                    }
                }
            ]
        }
    },
    {
        "group": {
            "name": "Functions",
            "items": [
                {
                    "item": {
                        "name": "assign",
                        "icon": "fa fa-square",
                        "data": {
                            "blockType": "Instruction",
                            "blockName": "assign",
                            "blockTemplates": {
                                "AssignTemplate": {
                                    "valueType": "Number",
                                    "templates": ["Number", "String", "Boolean"]
                                }
                            },
                            "blockInputs": [
                                {
                                    "pointType": "Stream",
                                    "pointName": "in"
                                },
                                {
                                    "pointType": "Point",
                                    "pointName": "this",
                                    "pointTemplate": "AssignTemplate",
                                    "pointValueType": "Number"
                                },
                                {
                                    "pointType": "Point",
                                    "pointName": "other",
                                    "pointTemplate": "AssignTemplate",
                                    "pointValueType": "Number"
                                }
                            ],
                            "blockOutputs": [
                                {
                                    "pointType": "Stream",
                                    "pointName": "out"
                                }
                            ]
                        }
                    }
                },
                {
                    "item": {
                        "name": "add_entity",
                        "icon": "fa fa-square",
                        "data": {
                            "blockType": "Instruction",
                            "blockName": "add_entity",
                            "blockInputs": [
                                {
                                    "pointType": "Stream",
                                    "pointName": "in"
                                },
                                {
                                    "pointType": "Point",
                                    "pointName": "entity",
                                    "pointValueType": "Object"
                                }
                            ],
                            "blockOutputs": [
                                {
                                    "pointType": "Stream",
                                    "pointName": "out"
                                }
                            ]
                        }
                    }
                },
                {
                    "item": {
                        "name": "remove_entity",
                        "icon": "fa fa-square",
                        "data": {
                            "blockType": "Instruction",
                            "blockName": "remove_entity",
                            "blockInputs": [
                                {
                                    "pointType": "Stream",
                                    "pointName": "in"
                                },
                                {
                                    "pointType": "Point",
                                    "pointName": "entity",
                                    "pointValueType": "Object"
                                }
                            ],
                            "blockOutputs": [
                                {
                                    "pointType": "Stream",
                                    "pointName": "out"
                                }
                            ]
                        }
                    }
                },
                {
                    "item": {
                        "name": "random",
                        "icon": "fa fa-square",
                        "data": {
                            "blockType": "Function",
                            "blockName": "random_range",
                            "blockInputs": [
                                {
                                    "pointType": "Point",
                                    "pointName": "from",
                                    "pointValueType": "Number"
                                },
                                {
                                    "pointType": "Point",
                                    "pointName": "to",
                                    "pointValueType": "Number"
                                }
                            ],
                            "blockOutputs": [
                                {
                                    "pointType": "Point",
                                    "pointName": "value",
                                    "pointValueType": "Number"
                                }
                            ]
                        }
                    }
                },
                {
                    "item": {
                        "name": "format",
                        "icon": "fa fa-square",
                        "data": {
                            "blockType": "Format",
                            "blockName": "format",
                            "blockInputs": [
                                {
                                    "pointType": "Point",
                                    "pointName": "format",
                                    "pointValueType": "String"
                                }
                            ],
                            "blockOutputs": [
                                {
                                    "pointType": "Point",
                                    "pointName": "value",
                                    "pointValueType": "String"
                                }
                            ]
                        }
                    }
                },
                {
                    "item": {
                        "name": "expression",
                        "icon": "fa fa-square",
                        "data": {
                            "blockType": "Expression",
                            "blockName": "expression",
                            "blockInputs": [
                                {
                                    "pointType": "Point",
                                    "pointName": "expression",
                                    "pointValueType": "String"
                                }
                            ],
                            "blockOutputs": [
                                {
                                    "pointType": "Point",
                                    "pointName": "value",
                                    "pointValueType": "Number"
                                }
                            ]
                        }
                    }
                }
            ]
        }
    },
    {
        "group": {
            "name": "Built-ins",
            "items": [
                {
                    "item": {
                        "name": "Condition",
                        "icon": "fa fa-share-alt",
                        "data": {
                            "blockType": "Condition",
                            "blockName": "Condition",
                            "blockInputs": [
                                {
                                    "pointType": "Stream",
                                    "pointName": "in"
                                },
                                {
                                    "pointType": "Point",
                                    "pointName": "test",
                                    "pointValueType": "Boolean"
                                }
                            ],
                            "blockOutputs": [
                                {
                                    "pointType": "Stream",
                                    "pointName": "true"
                                },
                                {
                                    "pointType": "Stream",
                                    "pointName": "false"
                                }
                            ]
                        }
                    }
                },
                {
                    "item": {
                        "name": "Each",
                        "icon": "fa fa-refresh",
                        "data": {
                            "blockType": "Each",
                            "blockName": "Each",
                            "blockInputs": [
                                {
                                    "pointType": "Stream",
                                    "pointName": "in"
                                },
                                {
                                    "pointType": "Point",
                                    "pointName": "list",
                                    "pointValueType": "List"
                                }
                            ],
                            "blockOutputs": [
                                {
                                    "pointType": "Stream",
                                    "pointName": "iteration"
                                },
                                {
                                    "pointType": "Stream",
                                    "pointName": "end"
                                }
                            ]
                        }
                    }
                },
                {
                    "item": {
                        "name": "Range",
                        "icon": "fa fa-retweet",
                        "data": {
                            "blockType": "Range",
                            "blockName": "Range",
                            "blockInputs": [
                                {
                                    "pointType": "Stream",
                                    "pointName": "in"
                                },
                                {
                                    "pointType": "Point",
                                    "pointName": "from",
                                    "pointValueType": "Number"
                                },
                                {
                                    "pointType": "Point",
                                    "pointName": "to",
                                    "pointValueType": "Number"
                                },
                                {
                                    "pointType": "Point",
                                    "pointName": "step",
                                    "pointValueType": "Number"
                                }
                            ],
                            "blockOutputs": [
                                {
                                    "pointType": "Stream",
                                    "pointName": "iteration"
                                },
                                {
                                    "pointType": "Stream",
                                    "pointName": "end"
                                }
                            ]
                        }
                    }
                }
            ]
        }
    }
];