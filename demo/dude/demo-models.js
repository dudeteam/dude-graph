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
                            "cgType": "Variable",
                            "cgValueType": "Entity",
                            "cgValue": "player",
                            "cgName": "player",
                            "cgInputs": [],
                            "cgOutputs": [
                                {
                                    "cgType": "Point",
                                    "cgValueType": "Entity",
                                    "cgName": "value"
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
                            "cgType": "Delegate",
                            "cgName": "on_start",
                            "cgInputs": [
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
                        "name": "on_update",
                        "icon": "fa fa-play",
                        "data": {
                            "cgType": "Delegate",
                            "cgName": "on_update",
                            "cgInputs": [
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
                        "name": "on_stop",
                        "icon": "fa fa-play",
                        "data": {
                            "cgType": "Delegate",
                            "cgName": "on_update",
                            "cgInputs": [
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
                        "name": "on_key_down",
                        "icon": "fa fa-play",
                        "data": {
                            "cgType": "Delegate",
                            "cgName": "on_key_down",
                            "cgInputs": [
                            ],
                            "cgOutputs": [
                                {
                                    "cgType": "Stream",
                                    "cgName": "out"
                                },
                                {
                                    "cgType": "Point",
                                    "cgValueType": "Choice",
                                    "cgName": "key"
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
                            "cgType": "Delegate",
                            "cgName": "on_key_down",
                            "cgInputs": [
                            ],
                            "cgOutputs": [
                                {
                                    "cgType": "Stream",
                                    "cgName": "out"
                                },
                                {
                                    "cgType": "Point",
                                    "cgValueType": "Choice",
                                    "cgName": "key"
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
                            "cgType": "Delegate",
                            "cgName": "on_key_down",
                            "cgInputs": [
                            ],
                            "cgOutputs": [
                                {
                                    "cgType": "Stream",
                                    "cgName": "out"
                                },
                                {
                                    "cgType": "Point",
                                    "cgValueType": "Choice",
                                    "cgName": "key"
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
                            "cgType": "Instruction",
                            "cgName": "assign",
                            "cgTemplates": {
                                "ValueType": ["Boolean", "Number", "String"]
                            },
                            "cgInputs": [
                                {
                                    "cgType": "Stream",
                                    "cgName": "in"
                                },
                                {
                                    "cgType": "Point",
                                    "cgName": "this",
                                    "cgTemplate": "ValueType",
                                    "cgValueType": "Number"
                                },
                                {
                                    "cgType": "Point",
                                    "cgName": "other",
                                    "cgTemplate": "ValueType",
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
                    }
                },
                {
                    "item": {
                        "name": "add_entity",
                        "icon": "fa fa-square",
                        "data": {
                            "cgType": "Instruction",
                            "cgName": "add_entity",
                            "cgInputs": [
                                {
                                    "cgType": "Stream",
                                    "cgName": "in"
                                },
                                {
                                    "cgType": "Point",
                                    "cgName": "entity",
                                    "cgValueType": "Entity"
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
                        "name": "remove_entity",
                        "icon": "fa fa-square",
                        "data": {
                            "cgType": "Instruction",
                            "cgName": "remove_entity",
                            "cgInputs": [
                                {
                                    "cgType": "Stream",
                                    "cgName": "in"
                                },
                                {
                                    "cgType": "Point",
                                    "cgName": "entity",
                                    "cgValueType": "Entity"
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
                        "name": "random",
                        "icon": "fa fa-square",
                        "data": {
                            "cgType": "Function",
                            "cgName": "random_range",
                            "cgInputs": [
                                {
                                    "cgType": "Point",
                                    "cgName": "from",
                                    "cgValueType": "Number"
                                },
                                {
                                    "cgType": "Point",
                                    "cgName": "to",
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
                        }
                    }
                },
                {
                    "item": {
                        "name": "format_string",
                        "icon": "fa fa-square",
                        "data": {
                            "cgType": "Expression",
                            "cgName": "format_string",
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
                        "name": "calc",
                        "icon": "fa fa-square",
                        "data": {
                            "cgType": "CalcExpression",
                            "cgName": "calc",
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
                                    "cgValueType": "Number"
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
                },
                {
                    "item": {
                        "name": "Each",
                        "icon": "fa fa-refresh",
                        "data": {
                            "cgType": "Each",
                            "cgName": "Each",
                            "cgInputs": [
                                {
                                    "cgType": "Stream",
                                    "cgName": "in"
                                },
                                {
                                    "cgType": "Point",
                                    "cgName": "list",
                                    "cgValueType": "List"
                                }
                            ],
                            "cgOutputs": [
                                {
                                    "cgType": "Stream",
                                    "cgName": "iteration"
                                },
                                {
                                    "cgType": "Stream",
                                    "cgName": "end"
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
                            "cgType": "Range",
                            "cgName": "Range",
                            "cgInputs": [
                                {
                                    "cgType": "Stream",
                                    "cgName": "in"
                                },
                                {
                                    "cgType": "Point",
                                    "cgName": "from",
                                    "cgValueType": "Number"
                                },
                                {
                                    "cgType": "Point",
                                    "cgName": "to",
                                    "cgValueType": "Number"
                                },
                                {
                                    "cgType": "Point",
                                    "cgName": "step",
                                    "cgValueType": "Number"
                                }
                            ],
                            "cgOutputs": [
                                {
                                    "cgType": "Stream",
                                    "cgName": "iteration"
                                },
                                {
                                    "cgType": "Stream",
                                    "cgName": "end"
                                }
                            ]
                        }
                    }
                }
            ]
        }
    }
];