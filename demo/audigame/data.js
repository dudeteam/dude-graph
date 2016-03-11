const DUDE_GRAPH_MODELS = [
    {
        "item": {
            "name": "Start",
            "icon": "fa fa-stop",
            "data": {
                "blockType": "Start",
                "blockName": "Start",
                "blockInputs": [
                    {
                        "pointType": "Point",
                        "pointName": "text",
                        "pointValueType": "String"
                    },
                    {
                        "pointType": "Point",
                        "pointName": "timer",
                        "pointValue": 5,
                        "pointValueType": "Number"
                    },
                    {
                        "pointType": "Point",
                        "pointName": "sound",
                        "pointValueType": "Resource"
                    },
                    {
                        "pointType": "Point",
                        "pointName": "cover",
                        "pointValueType": "Resource"
                    }
                ],
                "blockOutputs": [
                    {
                        "pointType": "Stream",
                        "pointName": "first"
                    },
                    {
                        "pointType": "Stream",
                        "pointName": "second"
                    }
                ]
            }
        }
    },
    {
        "item": {
            "name": "Step",
            "icon": "fa fa-stop",
            "data": {
                "blockType": "Step",
                "blockName": "Step",
                "blockInputs": [
                    {
                        "pointType": "Stream",
                        "pointName": "in",
                        "singleConnection": false
                    },
                    {
                        "pointType": "Point",
                        "pointName": "choice",
                        "pointValueType": "String"
                    },
                    {
                        "pointType": "Point",
                        "pointName": "text",
                        "pointValueType": "String"
                    },
                    {
                        "pointType": "Point",
                        "pointName": "timer",
                        "pointValue": 5,
                        "pointValueType": "Number"
                    },
                    {
                        "pointType": "Point",
                        "pointName": "sound",
                        "pointValueType": "Resource"
                    },
                    {
                        "pointType": "Point",
                        "pointName": "cover",
                        "pointValueType": "Resource"
                    }
                ],
                "blockOutputs": [
                    {
                        "pointType": "Stream",
                        "pointName": "first"
                    },
                    {
                        "pointType": "Stream",
                        "pointName": "second"
                    }
                ]
            }
        }
    },
    {
        "item": {
            "name": "End",
            "icon": "fa fa-stop",
            "data": {
                "blockType": "End",
                "blockName": "End",
                "blockInputs": [
                    {
                        "pointType": "Stream",
                        "pointName": "in",
                        "singleConnection": false
                    },
                    {
                        "pointType": "Point",
                        "pointName": "choice",
                        "pointValueType": "String"
                    },
                    {
                        "pointType": "Point",
                        "pointName": "text",
                        "pointValueType": "String"
                    },
                    {
                        "pointType": "Point",
                        "pointName": "sound",
                        "pointValueType": "Resource"
                    },
                    {
                        "pointType": "Point",
                        "pointName": "cover",
                        "pointValueType": "Resource"
                    }
                ]
            }
        }
    },
    {
        "group": {
            "name": "Variables",
            "items": [
                {
                    "item": {
                        "name": "has_key",
                        "icon": "fa fa-circle",
                        "data": {
                            "blockType": "Variable",
                            "blockValueType": "Boolean",
                            "blockValue": "has_key",
                            "blockName": "has_key",
                            "blockInputs": [],
                            "blockOutputs": [
                                {
                                    "pointType": "Point",
                                    "pointValueType": "Boolean",
                                    "pointName": "value"
                                }
                            ]
                        }
                    }
                },
                {
                    "item": {
                        "name": "nb_coins",
                        "icon": "fa fa-circle",
                        "data": {
                            "blockType": "Variable",
                            "blockValueType": "Number",
                            "blockValue": "nb_coins",
                            "blockName": "nb_coins",
                            "blockInputs": [],
                            "blockOutputs": [
                                {
                                    "pointType": "Point",
                                    "pointValueType": "Number",
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
                },
                {
                    "item": {
                        "name": "random_range",
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
                        "name": "print",
                        "icon": "fa fa-square",
                        "data": {
                            "blockType": "Instruction",
                            "blockName": "print",
                            "blockInputs": [
                                {
                                    "pointType": "Stream",
                                    "pointName": "in"
                                },
                                {
                                    "pointType": "Point",
                                    "pointName": "message",
                                    "pointValueType": "String"
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
const DUDE_GRAPH_DEFAULT_GRAPH_DATA = {"blocks":[{"blockType":"Instruction","blockId":"5467-df73-1a20-4e6b-a72e-eb5b02b46d45","blockName":"print","blockOutputs":[{"pointType":"Stream","pointName":"out","pointValueType":"Stream","pointValue":null,"pointTemplate":null,"pointSingleConnection":true}],"blockInputs":[{"pointType":"Stream","pointName":"in","pointValueType":"Stream","pointValue":null,"pointTemplate":null,"pointSingleConnection":true},{"pointType":"Point","pointName":"message","pointValueType":"String","pointValue":null,"pointTemplate":null,"pointSingleConnection":true}],"blockTemplates":{}},{"blockType":"Format","blockId":"5467-6843-e90d-7ca9-d520-0470a859f644","blockName":"format","blockOutputs":[{"pointType":"Point","pointName":"value","pointValueType":"String","pointValue":null,"pointTemplate":null,"pointSingleConnection":true}],"blockInputs":[{"pointType":"Point","pointName":"format","pointValueType":"String","pointValue":"has_key = {{has_key}}\nnb_coins = {{nb_coins}}","pointTemplate":null,"pointSingleConnection":true},{"pointType":"Point","pointName":"has_key","pointValueType":"String","pointValue":null,"pointTemplate":null,"pointSingleConnection":true},{"pointType":"Point","pointName":"nb_coins","pointValueType":"String","pointValue":null,"pointTemplate":null,"pointSingleConnection":true}],"blockTemplates":{}},{"blockType":"Variable","blockId":"5467-d96e-5e5e-f030-7a9b-f50e18f1d4f4","blockName":"nb_coins","blockOutputs":[{"pointType":"Point","pointName":"value","pointValueType":"Number","pointValue":null,"pointTemplate":null,"pointSingleConnection":true}],"blockInputs":[],"blockTemplates":{}},{"blockType":"Start","blockId":"5467-e52e-e118-2426-356e-a808c3bec6ac","blockName":"Start","blockOutputs":[{"pointType":"Stream","pointName":"first","pointValueType":"Stream","pointValue":null,"pointTemplate":null,"pointSingleConnection":true},{"pointType":"Stream","pointName":"second","pointValueType":"Stream","pointValue":null,"pointTemplate":null,"pointSingleConnection":true}],"blockInputs":[{"pointType":"Point","pointName":"text","pointValueType":"String","pointValue":null,"pointTemplate":null,"pointSingleConnection":true},{"pointType":"Point","pointName":"timer","pointValueType":"Number","pointValue":5,"pointTemplate":null,"pointSingleConnection":true},{"pointType":"Point","pointName":"sound","pointValueType":"Resource","pointValue":null,"pointTemplate":null,"pointSingleConnection":true},{"pointType":"Point","pointName":"cover","pointValueType":"Resource","pointValue":null,"pointTemplate":null,"pointSingleConnection":true}],"blockTemplates":{}},{"blockType":"Variable","blockId":"5467-3a89-21a2-0fb6-b979-4f87c9085356","blockName":"has_key","blockOutputs":[{"pointType":"Point","pointName":"value","pointValueType":"Boolean","pointValue":null,"pointTemplate":null,"pointSingleConnection":true}],"blockInputs":[],"blockTemplates":{}},{"blockType":"Step","blockId":"5467-4574-2c5f-6f89-2f13-b93de7fb546c","blockName":"Step","blockOutputs":[{"pointType":"Stream","pointName":"first","pointValueType":"Stream","pointValue":null,"pointTemplate":null,"pointSingleConnection":true},{"pointType":"Stream","pointName":"second","pointValueType":"Stream","pointValue":null,"pointTemplate":null,"pointSingleConnection":true}],"blockInputs":[{"pointType":"Stream","pointName":"in","pointValueType":"Stream","pointValue":null,"pointTemplate":null,"pointSingleConnection":true},{"pointType":"Point","pointName":"choice","pointValueType":"String","pointValue":null,"pointTemplate":null,"pointSingleConnection":true},{"pointType":"Point","pointName":"text","pointValueType":"String","pointValue":null,"pointTemplate":null,"pointSingleConnection":true},{"pointType":"Point","pointName":"timer","pointValueType":"Number","pointValue":5,"pointTemplate":null,"pointSingleConnection":true},{"pointType":"Point","pointName":"sound","pointValueType":"Resource","pointValue":null,"pointTemplate":null,"pointSingleConnection":true},{"pointType":"Point","pointName":"cover","pointValueType":"Resource","pointValue":null,"pointTemplate":null,"pointSingleConnection":true}],"blockTemplates":{}},{"blockType":"End","blockId":"5467-ca67-cff1-e5a1-aa63-a47fe90db073","blockName":"End","blockOutputs":[],"blockInputs":[{"pointType":"Stream","pointName":"in","pointValueType":"Stream","pointValue":null,"pointTemplate":null,"pointSingleConnection":true},{"pointType":"Point","pointName":"choice","pointValueType":"String","pointValue":null,"pointTemplate":null,"pointSingleConnection":true},{"pointType":"Point","pointName":"text","pointValueType":"String","pointValue":null,"pointTemplate":null,"pointSingleConnection":true},{"pointType":"Point","pointName":"sound","pointValueType":"Resource","pointValue":null,"pointTemplate":null,"pointSingleConnection":true},{"pointType":"Point","pointName":"cover","pointValueType":"Resource","pointValue":null,"pointTemplate":null,"pointSingleConnection":true}],"blockTemplates":{}},{"blockType":"Condition","blockId":"5467-81ce-521c-9087-3a98-5f7ca834f306","blockName":"Condition","blockOutputs":[{"pointType":"Stream","pointName":"true","pointValueType":"Stream","pointValue":null,"pointTemplate":null,"pointSingleConnection":true},{"pointType":"Stream","pointName":"false","pointValueType":"Stream","pointValue":null,"pointTemplate":null,"pointSingleConnection":true}],"blockInputs":[{"pointType":"Stream","pointName":"in","pointValueType":"Stream","pointValue":null,"pointTemplate":null,"pointSingleConnection":true},{"pointType":"Point","pointName":"test","pointValueType":"Boolean","pointValue":null,"pointTemplate":null,"pointSingleConnection":true}],"blockTemplates":{}},{"blockType":"End","blockId":"5467-3703-07e7-ca69-4bb4-42358599732c","blockName":"End","blockOutputs":[],"blockInputs":[{"pointType":"Stream","pointName":"in","pointValueType":"Stream","pointValue":null,"pointTemplate":null,"pointSingleConnection":true},{"pointType":"Point","pointName":"choice","pointValueType":"String","pointValue":null,"pointTemplate":null,"pointSingleConnection":true},{"pointType":"Point","pointName":"text","pointValueType":"String","pointValue":null,"pointTemplate":null,"pointSingleConnection":true},{"pointType":"Point","pointName":"sound","pointValueType":"Resource","pointValue":null,"pointTemplate":null,"pointSingleConnection":true},{"pointType":"Point","pointName":"cover","pointValueType":"Resource","pointValue":null,"pointTemplate":null,"pointSingleConnection":true}],"blockTemplates":{}},{"blockType":"End","blockId":"5467-5995-0b7f-b19b-5363-c9028a9aea46","blockName":"End","blockOutputs":[],"blockInputs":[{"pointType":"Stream","pointName":"in","pointValueType":"Stream","pointValue":null,"pointTemplate":null,"pointSingleConnection":true},{"pointType":"Point","pointName":"choice","pointValueType":"String","pointValue":null,"pointTemplate":null,"pointSingleConnection":true},{"pointType":"Point","pointName":"text","pointValueType":"String","pointValue":null,"pointTemplate":null,"pointSingleConnection":true},{"pointType":"Point","pointName":"sound","pointValueType":"Resource","pointValue":null,"pointTemplate":null,"pointSingleConnection":true},{"pointType":"Point","pointName":"cover","pointValueType":"Resource","pointValue":null,"pointTemplate":null,"pointSingleConnection":true}],"blockTemplates":{}},{"blockType":"Expression","blockId":"5467-2327-4594-f8df-ee91-2cc6a5163fc5","blockName":"expression","blockOutputs":[{"pointType":"Point","pointName":"value","pointValueType":"Number","pointValue":null,"pointTemplate":null,"pointSingleConnection":true}],"blockInputs":[{"pointType":"Point","pointName":"expression","pointValueType":"String","pointValue":"has_key && nb_coins > 10","pointTemplate":null,"pointSingleConnection":true},{"pointType":"Point","pointName":"has_key","pointValueType":"Number","pointValue":null,"pointTemplate":null,"pointSingleConnection":true},{"pointType":"Point","pointName":"nb_coins","pointValueType":"Number","pointValue":null,"pointTemplate":null,"pointSingleConnection":true}],"blockTemplates":{}},{"blockType":"Variable","blockId":"5467-9ca9-e8de-b74b-c9e1-f71b8cbba983","blockName":"has_key","blockOutputs":[{"pointType":"Point","pointName":"value","pointValueType":"Boolean","pointValue":null,"pointTemplate":null,"pointSingleConnection":true}],"blockInputs":[],"blockTemplates":{}},{"blockType":"Variable","blockId":"5467-cd1a-d87e-1dbe-1733-2c82fb0bf8fd","blockName":"nb_coins","blockOutputs":[{"pointType":"Point","pointName":"value","pointValueType":"Number","pointValue":null,"pointTemplate":null,"pointSingleConnection":true}],"blockInputs":[],"blockTemplates":{}}],"connections":[{"connectionOutputPoint":"value","connectionOutputBlock":"5467-6843-e90d-7ca9-d520-0470a859f644","connectionInputPoint":"message","connectionInputBlock":"5467-df73-1a20-4e6b-a72e-eb5b02b46d45"},{"connectionOutputPoint":"value","connectionOutputBlock":"5467-3a89-21a2-0fb6-b979-4f87c9085356","connectionInputPoint":"has_key","connectionInputBlock":"5467-6843-e90d-7ca9-d520-0470a859f644"},{"connectionOutputPoint":"value","connectionOutputBlock":"5467-d96e-5e5e-f030-7a9b-f50e18f1d4f4","connectionInputPoint":"nb_coins","connectionInputBlock":"5467-6843-e90d-7ca9-d520-0470a859f644"},{"connectionOutputPoint":"out","connectionOutputBlock":"5467-df73-1a20-4e6b-a72e-eb5b02b46d45","connectionInputPoint":"in","connectionInputBlock":"5467-4574-2c5f-6f89-2f13-b93de7fb546c"},{"connectionOutputPoint":"first","connectionOutputBlock":"5467-4574-2c5f-6f89-2f13-b93de7fb546c","connectionInputPoint":"in","connectionInputBlock":"5467-ca67-cff1-e5a1-aa63-a47fe90db073"},{"connectionOutputPoint":"first","connectionOutputBlock":"5467-e52e-e118-2426-356e-a808c3bec6ac","connectionInputPoint":"in","connectionInputBlock":"5467-81ce-521c-9087-3a98-5f7ca834f306"},{"connectionOutputPoint":"false","connectionOutputBlock":"5467-81ce-521c-9087-3a98-5f7ca834f306","connectionInputPoint":"in","connectionInputBlock":"5467-df73-1a20-4e6b-a72e-eb5b02b46d45"},{"connectionOutputPoint":"true","connectionOutputBlock":"5467-81ce-521c-9087-3a98-5f7ca834f306","connectionInputPoint":"in","connectionInputBlock":"5467-3703-07e7-ca69-4bb4-42358599732c"},{"connectionOutputPoint":"second","connectionOutputBlock":"5467-e52e-e118-2426-356e-a808c3bec6ac","connectionInputPoint":"in","connectionInputBlock":"5467-5995-0b7f-b19b-5363-c9028a9aea46"},{"connectionOutputPoint":"value","connectionOutputBlock":"5467-2327-4594-f8df-ee91-2cc6a5163fc5","connectionInputPoint":"test","connectionInputBlock":"5467-81ce-521c-9087-3a98-5f7ca834f306"},{"connectionOutputPoint":"value","connectionOutputBlock":"5467-9ca9-e8de-b74b-c9e1-f71b8cbba983","connectionInputPoint":"has_key","connectionInputBlock":"5467-2327-4594-f8df-ee91-2cc6a5163fc5"},{"connectionOutputPoint":"value","connectionOutputBlock":"5467-cd1a-d87e-1dbe-1733-2c82fb0bf8fd","connectionInputPoint":"nb_coins","connectionInputBlock":"5467-2327-4594-f8df-ee91-2cc6a5163fc5"}]};
const DUDE_GRAPH_DEFAULT_RENDERER_DATA = {"zoom":{"translate":[969.2281690140844,393.8633802816901],"scale":1.1535211267605636},"blocks":[{"id":"5467-df73-1a20-4e6b-a72e-eb5b02b46d45","block":"5467-df73-1a20-4e6b-a72e-eb5b02b46d45","description":"print","position":[-54,55],"parent":"5467-fcd9-f44a-2d57-9c92-799e80f70cc9"},{"id":"5467-6843-e90d-7ca9-d520-0470a859f644","block":"5467-6843-e90d-7ca9-d520-0470a859f644","description":"format","position":[-61,175.5],"parent":"5467-fcd9-f44a-2d57-9c92-799e80f70cc9"},{"id":"5467-d96e-5e5e-f030-7a9b-f50e18f1d4f4","block":"5467-d96e-5e5e-f030-7a9b-f50e18f1d4f4","description":"nb_coins","position":[-65,348],"parent":"5467-fcd9-f44a-2d57-9c92-799e80f70cc9"},{"id":"5467-e52e-e118-2426-356e-a808c3bec6ac","block":"5467-e52e-e118-2426-356e-a808c3bec6ac","description":"Start","position":[-635,-39],"parent":null},{"id":"5467-3a89-21a2-0fb6-b979-4f87c9085356","block":"5467-3a89-21a2-0fb6-b979-4f87c9085356","description":"has_key","position":[-61,295],"parent":"5467-fcd9-f44a-2d57-9c92-799e80f70cc9"},{"id":"5467-4574-2c5f-6f89-2f13-b93de7fb546c","block":"5467-4574-2c5f-6f89-2f13-b93de7fb546c","description":"Step","position":[287,-127.5],"parent":null},{"id":"5467-ca67-cff1-e5a1-aa63-a47fe90db073","block":"5467-ca67-cff1-e5a1-aa63-a47fe90db073","description":"End","position":[536,-148],"parent":null},{"id":"5467-81ce-521c-9087-3a98-5f7ca834f306","block":"5467-81ce-521c-9087-3a98-5f7ca834f306","description":"Condition","position":[-341,-133.5],"parent":"5467-8ff0-ad4e-18b4-136a-8bf3b42a755a"},{"id":"5467-3703-07e7-ca69-4bb4-42358599732c","block":"5467-3703-07e7-ca69-4bb4-42358599732c","description":"End","position":[32,-297],"parent":null},{"id":"5467-5995-0b7f-b19b-5363-c9028a9aea46","block":"5467-5995-0b7f-b19b-5363-c9028a9aea46","description":"End","position":[-587,117.5],"parent":null},{"id":"5467-2327-4594-f8df-ee91-2cc6a5163fc5","block":"5467-2327-4594-f8df-ee91-2cc6a5163fc5","description":"expression","position":[-367,-23],"parent":"5467-8ff0-ad4e-18b4-136a-8bf3b42a755a"},{"id":"5467-9ca9-e8de-b74b-c9e1-f71b8cbba983","block":"5467-9ca9-e8de-b74b-c9e1-f71b8cbba983","description":"has_key","position":[-361,105],"parent":"5467-8ff0-ad4e-18b4-136a-8bf3b42a755a"},{"id":"5467-cd1a-d87e-1dbe-1733-2c82fb0bf8fd","block":"5467-cd1a-d87e-1dbe-1733-2c82fb0bf8fd","description":"nb_coins","position":[-364,156],"parent":"5467-8ff0-ad4e-18b4-136a-8bf3b42a755a"}],"groups":[{"id":"5467-fcd9-f44a-2d57-9c92-799e80f70cc9","description":"Some debug...","position":[-75,15]},{"id":"5467-8ff0-ad4e-18b4-136a-8bf3b42a755a","description":"Condition example","position":[-377,-173.5]}],"connections":[{"connectionIndex":0,"outputName":"value","outputRendererBlockId":"5467-6843-e90d-7ca9-d520-0470a859f644","inputName":"message","inputRendererBlockId":"5467-df73-1a20-4e6b-a72e-eb5b02b46d45"},{"connectionIndex":1,"outputName":"value","outputRendererBlockId":"5467-3a89-21a2-0fb6-b979-4f87c9085356","inputName":"has_key","inputRendererBlockId":"5467-6843-e90d-7ca9-d520-0470a859f644"},{"connectionIndex":2,"outputName":"value","outputRendererBlockId":"5467-d96e-5e5e-f030-7a9b-f50e18f1d4f4","inputName":"nb_coins","inputRendererBlockId":"5467-6843-e90d-7ca9-d520-0470a859f644"},{"connectionIndex":3,"outputName":"out","outputRendererBlockId":"5467-df73-1a20-4e6b-a72e-eb5b02b46d45","inputName":"in","inputRendererBlockId":"5467-4574-2c5f-6f89-2f13-b93de7fb546c"},{"connectionIndex":4,"outputName":"first","outputRendererBlockId":"5467-4574-2c5f-6f89-2f13-b93de7fb546c","inputName":"in","inputRendererBlockId":"5467-ca67-cff1-e5a1-aa63-a47fe90db073"},{"connectionIndex":5,"outputName":"first","outputRendererBlockId":"5467-e52e-e118-2426-356e-a808c3bec6ac","inputName":"in","inputRendererBlockId":"5467-81ce-521c-9087-3a98-5f7ca834f306"},{"connectionIndex":6,"outputName":"false","outputRendererBlockId":"5467-81ce-521c-9087-3a98-5f7ca834f306","inputName":"in","inputRendererBlockId":"5467-df73-1a20-4e6b-a72e-eb5b02b46d45"},{"connectionIndex":7,"outputName":"true","outputRendererBlockId":"5467-81ce-521c-9087-3a98-5f7ca834f306","inputName":"in","inputRendererBlockId":"5467-3703-07e7-ca69-4bb4-42358599732c"},{"connectionIndex":8,"outputName":"second","outputRendererBlockId":"5467-e52e-e118-2426-356e-a808c3bec6ac","inputName":"in","inputRendererBlockId":"5467-5995-0b7f-b19b-5363-c9028a9aea46"},{"connectionIndex":9,"outputName":"value","outputRendererBlockId":"5467-2327-4594-f8df-ee91-2cc6a5163fc5","inputName":"test","inputRendererBlockId":"5467-81ce-521c-9087-3a98-5f7ca834f306"},{"connectionIndex":10,"outputName":"value","outputRendererBlockId":"5467-9ca9-e8de-b74b-c9e1-f71b8cbba983","inputName":"has_key","inputRendererBlockId":"5467-2327-4594-f8df-ee91-2cc6a5163fc5"},{"connectionIndex":11,"outputName":"value","outputRendererBlockId":"5467-cd1a-d87e-1dbe-1733-2c82fb0bf8fd","inputName":"nb_coins","inputRendererBlockId":"5467-2327-4594-f8df-ee91-2cc6a5163fc5"}]};
const DUDE_GRAPH_BLOCK_TYPES = dudeGraph.defaultBlocks;
const DUDE_GRAPH_POINT_TYPES = dudeGraph.defaultPoints;
const DUDE_GRAPH_RENDER_BLOCK_TYPES = dudeGraph.defaultRenderBlocks;

(function Blocks() {
    (function Start() {
        /**
         * Represents the start of a story
         * @param {dudeGraph.Block.blockDataTypedef} [blockData={}]
         * @class
         * @extends {dudeGraph.Block}
         */
        var Start = function (blockData) {
            dudeGraph.Block.call(this, blockData);
        };

        Start.prototype = _.create(dudeGraph.Block.prototype, {
            "constructor": Start,
            "className": "Start"
        });

        /**
         * Called when the basic points are created
         * @override
         */
        Start.prototype.validatePoints = function () {
            if (!(this.inputByName("text") instanceof dudeGraph.Point) || this.inputByName("text").pointValueType !== "String") {
                throw new Error("Start `" + this.cgId + "` must have an input `text` of type `Point` of pointValueType `String`");
            }
            if (!(this.inputByName("timer") instanceof dudeGraph.Point) || this.inputByName("timer").pointValueType !== "Number") {
                throw new Error("Start `" + this.cgId + "` must have an input `timer` of type `Point` of pointValueType `Number`");
            }
            if (!(this.inputByName("sound") instanceof dudeGraph.Point) || this.inputByName("sound").pointValueType !== "Resource") {
                throw new Error("Start `" + this.cgId + "` must have an input `sound` of type `Point` of pointValueType `Resource`");
            }
            if (!(this.inputByName("cover") instanceof dudeGraph.Point) || this.inputByName("cover").pointValueType !== "Resource") {
                throw new Error("Start `" + this.cgId + "` must have an input `cover` of type `Point` of pointValueType `Resource`");
            }
            if (!(this.outputByName("first") instanceof dudeGraph.Stream)) {
                throw new Error("Start `" + this.cgId + "` must have an output `first` of type `Stream`");
            }
            if (!(this.outputByName("second") instanceof dudeGraph.Stream)) {
                throw new Error("Start `" + this.cgId + "` must have an output `second` of type `Stream`");
            }
        };

        DUDE_GRAPH_BLOCK_TYPES.push({"block": "Start", "type": Start});
    })();
    (function Step() {
        /**
         * Represents a step in a story with two choices
         * @param {dudeGraph.Block.blockDataTypedef} [blockData={}]
         * @class
         * @extends {dudeGraph.Block}
         */
        var Step = function (blockData) {
            dudeGraph.Block.call(this, blockData);
        };

        Step.prototype = _.create(dudeGraph.Block.prototype, {
            "constructor": Step,
            "className": "Step"
        });

        /**
         * Called when the basic points are created
         * @override
         */
        Step.prototype.validatePoints = function () {
            if (!(this.inputByName("in") instanceof dudeGraph.Stream)) {
                throw new Error("Step `" + this.cgId + "` must have an input `in` of type `Stream`");
            }
            if (!(this.inputByName("choice") instanceof dudeGraph.Point) || this.inputByName("choice").pointValueType !== "String") {
                throw new Error("Step `" + this.cgId + "` must have an input `choice` of type `Point` of pointValueType `String`");
            }
            if (!(this.inputByName("text") instanceof dudeGraph.Point) || this.inputByName("text").pointValueType !== "String") {
                throw new Error("Step `" + this.cgId + "` must have an input `text` of type `Point` of pointValueType `String`");
            }
            if (!(this.inputByName("timer") instanceof dudeGraph.Point) || this.inputByName("timer").pointValueType !== "Number") {
                throw new Error("Step `" + this.cgId + "` must have an input `timer` of type `Point` of pointValueType `Number`");
            }
            if (!(this.inputByName("sound") instanceof dudeGraph.Point) || this.inputByName("sound").pointValueType !== "Resource") {
                throw new Error("Step `" + this.cgId + "` must have an input `sound` of type `Point` of pointValueType `Resource`");
            }
            if (!(this.inputByName("cover") instanceof dudeGraph.Point) || this.inputByName("cover").pointValueType !== "Resource") {
                throw new Error("Step `" + this.cgId + "` must have an input `cover` of type `Point` of pointValueType `Resource`");
            }
            if (!(this.outputByName("first") instanceof dudeGraph.Stream)) {
                throw new Error("Step `" + this.cgId + "` must have an output `first` of type `Stream`");
            }
            if (!(this.outputByName("second") instanceof dudeGraph.Stream)) {
                throw new Error("Step `" + this.cgId + "` must have an output `second` of type `Stream`");
            }
        };

        DUDE_GRAPH_BLOCK_TYPES.push({"block": "Step", "type": Step});

    })();
    (function End() {
        /**
         * Represents a terminal node of a story
         * @param {dudeGraph.Block.blockDataTypedef} [blockData={}]
         * @class
         * @extends {dudeGraph.Block}
         */
        var End = function (blockData) {
            dudeGraph.Block.call(this, blockData);
        };

        End.prototype = _.create(dudeGraph.Block.prototype, {
            "constructor": End,
            "className": "End"
        });

        /**
         * Called when the basic points are created
         * @override
         */
        End.prototype.validatePoints = function () {
            if (!(this.inputByName("in") instanceof dudeGraph.Stream)) {
                throw new Error("End `" + this.cgId + "` must have an input `in` of type `Stream`");
            }
            if (!(this.inputByName("choice") instanceof dudeGraph.Point) || this.inputByName("choice").pointValueType !== "String") {
                throw new Error("End `" + this.cgId + "` must have an input `choice` of type `Point` of pointValueType `String`");
            }
            if (!(this.inputByName("text") instanceof dudeGraph.Point) || this.inputByName("text").pointValueType !== "String") {
                throw new Error("End `" + this.cgId + "` must have an input `text` of type `Point` of pointValueType `String`");
            }
            if (!(this.inputByName("sound") instanceof dudeGraph.Point) || this.inputByName("sound").pointValueType !== "Resource") {
                throw new Error("End `" + this.cgId + "` must have an input `sound` of type `Point` of pointValueType `Resource`");
            }
            if (!(this.inputByName("cover") instanceof dudeGraph.Point) || this.inputByName("cover").pointValueType !== "Resource") {
                throw new Error("End `" + this.cgId + "` must have an input `cover` of type `Point` of pointValueType `Resource`");
            }
        };

        DUDE_GRAPH_BLOCK_TYPES.push({"block": "End", "type": End});

    })();
})();
(function RenderBlocks() {
    (function AudigameBlock() {
        /**
         * Renders blocks with custom colors
         * @class
         * @extends {dudeGraph.RenderBlock}
         */
        var AudigameBlock = function () {
            dudeGraph.RenderBlock.apply(this, arguments);
        };

        AudigameBlock.prototype = _.create(dudeGraph.RenderBlock.prototype, {
            "constructor": AudigameBlock,
            "className": "AudigameBlock"
        });

        AudigameBlock.buildRenderBlock = function () {
            return dudeGraph.RenderBlock.buildRenderBlock.apply(this, arguments);
        };

        AudigameBlock.prototype.update = function () {
            dudeGraph.RenderBlock.prototype.update.apply(this, arguments);
            switch (this._block.className) {
                case "Start":
                    this._d3Rect.attr("style", "fill: #006000;");
                    break;
                case "End":
                    this._d3Rect.attr("style", "fill: #600000;");
                    break;
            }
        };

        DUDE_GRAPH_RENDER_BLOCK_TYPES.push({"renderBlock": "Start", "type": AudigameBlock});
        DUDE_GRAPH_RENDER_BLOCK_TYPES.push({"renderBlock": "Step", "type": AudigameBlock});
        DUDE_GRAPH_RENDER_BLOCK_TYPES.push({"renderBlock": "End", "type": AudigameBlock});
    })();
})();