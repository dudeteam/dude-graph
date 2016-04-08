const DUDE_GRAPH_MODELS = [
    {
        "item": {
            "name": "Start",
            "icon": "fa fa-rocket",
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
                        "pointValue": 0,
                        "pointValueType": "Number"
                    },
                    {
                        "pointType": "ResourcePoint",
                        "pointName": "sound",
                        "pointValueType": "Resource",
                        "pointValue": {
                            "resourceType": "Sound"
                        }
                    },
                    {
                        "pointType": "ResourcePoint",
                        "pointName": "cover",
                        "pointValueType": "Resource",
                        "pointValue": {
                            "resourceType": "Image"
                        }
                    }
                ],
                "blockOutputs": [
                    {
                        "pointType": "StreamPoint",
                        "pointName": "first",
                        "pointValueType": "Stream"
                    },
                    {
                        "pointType": "StreamPoint",
                        "pointName": "second",
                        "pointValueType": "Stream"
                    },
                    {
                        "pointType": "StreamPoint",
                        "pointName": "timeout",
                        "pointValueType": "Stream"
                    }
                ]
            }
        }
    },
    {
        "item": {
            "name": "Step",
            "icon": "fa fa-puzzle-piece",
            "data": {
                "blockType": "Step",
                "blockName": "Step",
                "blockInputs": [
                    {
                        "pointType": "StreamPoint",
                        "pointName": "in",
                        "pointValueType": "Stream",
                        "pointSingleConnection": false
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
                        "pointValue": 0,
                        "pointValueType": "Number"
                    },
                    {
                        "pointType": "ResourcePoint",
                        "pointName": "sound",
                        "pointValueType": "Resource",
                        "pointValue": {
                            "resourceType": "Sound"
                        }
                    },
                    {
                        "pointType": "ResourcePoint",
                        "pointName": "cover",
                        "pointValueType": "Resource",
                        "pointValue": {
                            "resourceType": "Image"
                        }
                    }
                ],
                "blockOutputs": [
                    {
                        "pointType": "StreamPoint",
                        "pointName": "first",
                        "pointValueType": "Stream"
                    },
                    {
                        "pointType": "StreamPoint",
                        "pointName": "second",
                        "pointValueType": "Stream"
                    },
                    {
                        "pointType": "StreamPoint",
                        "pointName": "timeout",
                        "pointValueType": "Stream"
                    }
                ]
            }
        }
    },
    {
        "item": {
            "name": "End",
            "icon": "fa fa-ban",
            "data": {
                "blockType": "End",
                "blockName": "End",
                "blockInputs": [
                    {
                        "pointType": "StreamPoint",
                        "pointName": "in",
                        "pointValueType": "Stream",
                        "pointSingleConnection": false
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
                        "pointType": "ResourcePoint",
                        "pointName": "sound",
                        "pointValueType": "Resource",
                        "pointValue": {
                            "resourceType": "Sound"
                        }
                    },
                    {
                        "pointType": "ResourcePoint",
                        "pointName": "cover",
                        "pointValueType": "Resource",
                        "pointValue": {
                            "resourceType": "Image"
                        }
                    }
                ]
            }
        }
    },
    {
        "group": {
            "name": "Controls",
            "items": [
                {
                    "item": {
                        "name": "Go",
                        "icon": "fa fa-road",
                        "data": {
                            "blockType": "InstructionBlock",
                            "blockName": "Go",
                            "blockInputs": [
                                {
                                    "pointType": "StreamPoint",
                                    "pointName": "in",
                                    "pointValueType": "Stream",
                                    "pointSingleConnection": false
                                }
                            ],
                            "blockOutputs": [
                                {
                                    "pointType": "StreamPoint",
                                    "pointName": "out",
                                    "pointValueType": "Stream"
                                }
                            ]
                        }
                    }
                },
                {
                    "item": {
                        "name": "Condition",
                        "icon": "fa fa-question",
                        "data": {
                            "blockType": "ConditionBlock",
                            "blockName": "Condition",
                            "blockInputs": [
                                {
                                    "pointType": "StreamPoint",
                                    "pointName": "in",
                                    "pointValueType": "Stream",
                                    "pointSingleConnection": false
                                },
                                {
                                    "pointType": "Point",
                                    "pointName": "test",
                                    "pointValueType": "Boolean"
                                }
                            ],
                            "blockOutputs": [
                                {
                                    "pointType": "StreamPoint",
                                    "pointName": "true",
                                    "pointValueType": "Stream"
                                },
                                {
                                    "pointType": "StreamPoint",
                                    "pointName": "false",
                                    "pointValueType": "Stream"
                                }
                            ]
                        }
                    }
                },
                {
                    "item": {
                        "name": "Repeat",
                        "icon": "fa fa-repeat",
                        "data": {
                            "blockType": "RangeBlock",
                            "blockName": "Repeat",
                            "blockInputs": [
                                {
                                    "pointType": "StreamPoint",
                                    "pointName": "in",
                                    "pointValueType": "Stream",
                                    "pointSingleConnection": false
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
                                    "pointType": "StreamPoint",
                                    "pointName": "iteration",
                                    "pointValueType": "Stream"
                                },
                                {
                                    "pointType": "StreamPoint",
                                    "pointName": "end",
                                    "pointValueType": "Stream"
                                },
                                {
                                    "pointType": "Point",
                                    "pointName": "index",
                                    "pointValueType": "Number"
                                }
                            ]
                        }
                    }
                },
                {
                    "item": {
                        "name": "Assign",
                        "icon": "fa fa-long-arrow-left",
                        "data": {
                            "blockType": "InstructionBlock",
                            "blockName": "Assign",
                            "blockTemplates": {
                                "AssignTemplate": {
                                    "valueType": "Number",
                                    "templates": ["Number", "String", "Boolean"]
                                }
                            },
                            "blockInputs": [
                                {
                                    "pointType": "StreamPoint",
                                    "pointName": "in",
                                    "pointValueType": "Stream",
                                    "pointSingleConnection": false
                                },
                                {
                                    "pointType": "Point",
                                    "pointName": "variable",
                                    "pointTemplate": "AssignTemplate",
                                    "pointValueType": "Number",
                                    "pointCanConvert": false
                                },
                                {
                                    "pointType": "Point",
                                    "pointName": "value",
                                    "pointTemplate": "AssignTemplate",
                                    "pointValueType": "Number"
                                }
                            ],
                            "blockOutputs": [
                                {
                                    "pointType": "StreamPoint",
                                    "pointName": "out",
                                    "pointValueType": "Stream"
                                }
                            ]
                        }
                    }
                },
                {
                    "item": {
                        "name": "Print",
                        "icon": "fa fa-bug",
                        "data": {
                            "blockType": "InstructionBlock",
                            "blockName": "Print",
                            "blockInputs": [
                                {
                                    "pointType": "StreamPoint",
                                    "pointName": "in",
                                    "pointValueType": "Stream",
                                    "pointSingleConnection": false
                                },
                                {
                                    "pointType": "Point",
                                    "pointName": "message",
                                    "pointValueType": "String"
                                }
                            ],
                            "blockOutputs": [
                                {
                                    "pointType": "StreamPoint",
                                    "pointName": "out",
                                    "pointValueType": "Stream"
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
                        "name": "format",
                        "icon": "fa fa-font",
                        "data": {
                            "blockType": "FormatBlock",
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
                                    "pointValueType": "String",
                                    "pointSingleConnection": false
                                }
                            ]
                        }
                    }
                },
                {
                    "item": {
                        "name": "expression",
                        "icon": "fa fa-calculator",
                        "data": {
                            "blockType": "ExpressionBlock",
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
                                    "pointValueType": "Number",
                                    "pointSingleConnection": false
                                }
                            ]
                        }
                    }
                },
                {
                    "item": {
                        "name": "random_range",
                        "icon": "fa fa-sort-numeric-asc",
                        "data": {
                            "blockType": "FunctionBlock",
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
                }
            ]
        }
    }
];
const DUDE_GRAPH_DEFAULT_GRAPH_DATA = {};
const DUDE_GRAPH_DEFAULT_RENDERER_DATA = {};
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
                throw new Error("Start `" + this.blockFancyName + "` must have an input `text` of type `Point` of pointValueType `String`");
            }
            if (!(this.inputByName("timer") instanceof dudeGraph.Point) || this.inputByName("timer").pointValueType !== "Number") {
                throw new Error("Start `" + this.blockFancyName + "` must have an input `timer` of type `Point` of pointValueType `Number`");
            }
            if (!(this.inputByName("sound") instanceof dudeGraph.ResourcePoint) || this.inputByName("sound").pointValueType !== "Resource") {
                throw new Error("Start `" + this.blockFancyName + "` must have an input `sound` of type `Resource`");
            }
            if (!(this.inputByName("cover") instanceof dudeGraph.ResourcePoint) || this.inputByName("cover").pointValueType !== "Resource") {
                throw new Error("Start `" + this.blockFancyName + "` must have an input `cover` of type `Resource`");
            }
            if (!(this.outputByName("first") instanceof dudeGraph.StreamPoint)) {
                throw new Error("Start `" + this.blockFancyName + "` must have an output `first` of type `Stream`");
            }
            if (!(this.outputByName("second") instanceof dudeGraph.StreamPoint)) {
                throw new Error("Start `" + this.blockFancyName + "` must have an output `second` of type `Stream`");
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
            if (!(this.inputByName("in") instanceof dudeGraph.StreamPoint)) {
                throw new Error("Step `" + this.blockFancyName + "` must have an input `in` of type `Stream`");
            }
            if (!(this.inputByName("choice") instanceof dudeGraph.Point) || this.inputByName("choice").pointValueType !== "String") {
                throw new Error("Step `" + this.blockFancyName + "` must have an input `choice` of type `Point` of pointValueType `String`");
            }
            if (!(this.inputByName("text") instanceof dudeGraph.Point) || this.inputByName("text").pointValueType !== "String") {
                throw new Error("Step `" + this.blockFancyName + "` must have an input `text` of type `Point` of pointValueType `String`");
            }
            if (!(this.inputByName("timer") instanceof dudeGraph.Point) || this.inputByName("timer").pointValueType !== "Number") {
                throw new Error("Step `" + this.blockFancyName + "` must have an input `timer` of type `Point` of pointValueType `Number`");
            }
            if (!(this.inputByName("sound") instanceof dudeGraph.ResourcePoint) || this.inputByName("sound").pointValueType !== "Resource") {
                throw new Error("Step `" + this.blockFancyName + "` must have an input `sound` of type `Resource`");
            }
            if (!(this.inputByName("cover") instanceof dudeGraph.ResourcePoint) || this.inputByName("cover").pointValueType !== "Resource") {
                throw new Error("Step `" + this.blockFancyName + "` must have an input `cover` of type `Resource`");
            }
            if (!(this.outputByName("first") instanceof dudeGraph.StreamPoint)) {
                throw new Error("Step `" + this.blockFancyName + "` must have an output `first` of type `Stream`");
            }
            if (!(this.outputByName("second") instanceof dudeGraph.StreamPoint)) {
                throw new Error("Step `" + this.blockFancyName + "` must have an output `second` of type `Stream`");
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
            if (!(this.inputByName("in") instanceof dudeGraph.StreamPoint)) {
                throw new Error("End `" + this.blockFancyName + "` must have an input `in` of type `Stream`");
            }
            if (!(this.inputByName("choice") instanceof dudeGraph.Point) || this.inputByName("choice").pointValueType !== "String") {
                throw new Error("End `" + this.blockFancyName + "` must have an input `choice` of type `Point` of pointValueType `String`");
            }
            if (!(this.inputByName("text") instanceof dudeGraph.Point) || this.inputByName("text").pointValueType !== "String") {
                throw new Error("End `" + this.blockFancyName + "` must have an input `text` of type `Point` of pointValueType `String`");
            }
            if (!(this.inputByName("sound") instanceof dudeGraph.ResourcePoint) || this.inputByName("sound").pointValueType !== "Resource") {
                throw new Error("End `" + this.blockFancyName + "` must have an input `sound` of type `Resource`");
            }
            if (!(this.inputByName("cover") instanceof dudeGraph.ResourcePoint) || this.inputByName("cover").pointValueType !== "Resource") {
                throw new Error("End `" + this.blockFancyName + "` must have an input `cover` of type `Resource`");
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