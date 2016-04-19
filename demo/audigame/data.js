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
                            "resourceValueType": "Sound"
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
                            "resourceValueType": "Sound"
                        }
                    },
                    {
                        "pointType": "ResourcePoint",
                        "pointName": "cover",
                        "pointValueType": "Resource",
                        "pointValue": {
                            "resourceValueType": "Image"
                        }
                    },
                    {
                        "pointType": "Point",
                        "pointName": "success",
                        "pointValueType": "Success"
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
                            "resourceValueType": "Sound"
                        }
                    },
                    {
                        "pointType": "ResourcePoint",
                        "pointName": "cover",
                        "pointValueType": "Resource",
                        "pointValue": {
                            "resourceValueType": "Image"
                        }
                    },
                    {
                        "pointType": "Point",
                        "pointName": "success",
                        "pointValueType": "Success"
                    },
                    {
                        "pointType": "Point",
                        "pointName": "win",
                        "pointValueType": "Boolean",
                        "pointValue": false
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
                                    "pointValueType": "Number",
                                    "pointValue": 0
                                },
                                {
                                    "pointType": "Point",
                                    "pointName": "to",
                                    "pointValueType": "Number",
                                    "pointValue": 100
                                },
                                {
                                    "pointType": "Point",
                                    "pointName": "round",
                                    "pointValueType": "Boolean",
                                    "pointValue": true
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
            "name": "Trophy",
            "items": [
                {
                    "item": {
                        "name": "trophy",
                        "icon": "fa fa-trophy",
                        "data": {
                            "blockType": "Block",
                            "blockName": "trophy",
                            "blockInputs": [
                                {
                                    "pointType": "Point",
                                    "pointName": "type",
                                    "pointValueType": "String"
                                },
                                {
                                    "pointType": "Point",
                                    "pointName": "name",
                                    "pointValueType": "String"
                                },
                                {
                                    "pointType": "Point",
                                    "pointName": "icon",
                                    "pointValueType": "String"
                                }
                            ],
                            "blockOutputs": [
                                {
                                    "pointType": "Point",
                                    "pointName": "success",
                                    "pointValueType": "Success"
                                }
                            ]
                        }
                    }
                }
            ]
        }
    }
];
const DUDE_GRAPH_GRAPH_VALUE_TYPES = [
    {
        "typeName": "Success",
        "typeConvert": function (value) {
            return value;
        }
    }
];
const DUDE_GRAPH_DEFAULT_GRAPH_DATA = {};
const DUDE_GRAPH_DEFAULT_RENDERER_DATA = {};
const DUDE_GRAPH_BLOCK_TYPES = dudeGraph.defaultBlocks;
const DUDE_GRAPH_POINT_TYPES = dudeGraph.defaultPoints;
const DUDE_GRAPH_RENDER_BLOCK_TYPES = dudeGraph.defaultRenderBlocks;

(function Blocks() {

    /**
     * Ensures that the point `pointName` exists
     * @param {String} pointName
     * @param {dudeGraph.Graph.graphValueTypeTypedef} pointValueType
     * @param {*|null} [pointValue=null]
     */
    const ensurePoint = function (pointName, pointValueType, pointValue) {
        const point = this.inputByName(pointName);
        if (!(point instanceof dudeGraph.Point)) {
            this.addPoint(new dudeGraph.Point(false, {
                "pointName": pointName,
                "pointValueType": pointValueType,
                "pointValue": typeof pointValue !== "undefined" ? pointValue : null
            }));
        } else {
            point.pointValueType = pointValueType;
            point.pointValue = typeof pointValue !== "undefined" ? pointValue : null;
        }
    };

    /**
     * Upgrades cover.pointValue
     * Upgrades sound.pointValue
     */
    const upgradeResources = function () {
        var sound = this.inputByName("sound");
        var cover = this.inputByName("cover");
        sound.pointPropertyData = {"resourceValueType": "Sound"};
        cover.pointPropertyData = {"resourceValueType": "Image"};
        if (sound.pointValue !== null) {
            if (typeof sound.pointValue.resourceValue !== "undefined") {
                sound.pointValue = sound.pointValue.resourceValue;
            } else if (sound.pointValue !== null) {
                sound.pointValue = null;
            }
        }
        if (cover.pointValue !== null) {
            if (typeof cover.pointValue.resourceValue !== "undefined") {
                cover.pointValue = cover.pointValue.resourceValue;
            } else if (cover.pointValue !== null) {
                cover.pointValue = null;
            }
        }
    };

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
            this.upgradePoints();
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

        /**
         * Upgrade missing points in older versions
         */
        Start.prototype.upgradePoints = function () {
            upgradeResources.call(this);
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
            this.upgradePoints();
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
            if (!(this.inputByName("success") instanceof dudeGraph.ResourcePoint) || this.inputByName("success").pointValueType !== "Success") {
                throw new Error("End `" + this.blockFancyName + "` must have an input `success` of type `Success`");
            }
            if (!(this.outputByName("first") instanceof dudeGraph.StreamPoint)) {
                throw new Error("Step `" + this.blockFancyName + "` must have an output `first` of type `Stream`");
            }
            if (!(this.outputByName("second") instanceof dudeGraph.StreamPoint)) {
                throw new Error("Step `" + this.blockFancyName + "` must have an output `second` of type `Stream`");
            }
        };

        /**
         * Upgrade missing points in older versions
         */
        Step.prototype.upgradePoints = function () {
            upgradeResources.call(this);
            ensurePoint.call(this, "success", "Success");
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
            this.upgradePoints();
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
            if (!(this.inputByName("success") instanceof dudeGraph.Point) || this.inputByName("success").pointValueType !== "Success") {
                throw new Error("End `" + this.blockFancyName + "` must have an input `success` of type `Success`");
            }
            if (!(this.inputByName("win") instanceof dudeGraph.Point) || this.inputByName("win").pointValueType !== "Boolean") {
                throw new Error("End `" + this.blockFancyName + "` must have an input `win` of type `Boolean`");
            }
        };

        /**
         * Upgrade missing points in older versions
         */
        End.prototype.upgradePoints = function () {
            upgradeResources.call(this);
            ensurePoint.call(this, "success", "Success");
            ensurePoint.call(this, "win", "Boolean", false);
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
            /**
             * The success star
             * @type {d3.selection}
             * @private
             */
            this._d3SuccessStar = null;

            dudeGraph.RenderBlock.apply(this, arguments);
        };

        AudigameBlock.prototype = _.create(dudeGraph.RenderBlock.prototype, {
            "constructor": AudigameBlock,
            "className": "AudigameBlock"
        });

        /**
         * Creates the d3Block for this renderBlock
         * @override
         */
        AudigameBlock.prototype.create = function () {
            dudeGraph.RenderBlock.prototype.create.apply(this, arguments);
            this.onSuccessStar();
        };

        /**
         * Updates the d3Block for this renderBlock
         * @override
         */
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

        /**
         * Creates the success star if the success point is connected
         */
        AudigameBlock.prototype.onSuccessStar = function () {
            var success = this._block.inputByName("success");
            if (success !== null) {
                if (!success.emptyConnection() && this._d3SuccessStar === null) {
                    this.createSuccessStar();
                }
                success.on("connect", function () {
                    if (this._d3SuccessStar === null) {
                        this.createSuccessStar();
                    }
                }.bind(this));
                success.on("disconnect", function () {
                    if (this._d3SuccessStar !== null) {
                        this._d3SuccessStar.remove();
                        this._d3SuccessStar = null;
                    }
                }.bind(this));
            }
        };

        /**
         * Creates the success star
         */
        AudigameBlock.prototype.createSuccessStar = function () {
            this._d3SuccessStar = this._d3Node.append("svg:polygon")
                .attr("fill", this._renderer.config.typeColors.Success);
            this._d3SuccessStar.attr("points", function () {
                var starPoints = [];
                var pins = 5;
                var angle = Math.PI / pins;
                for (var i = 0; i < pins * 2; i++) {
                    var radius = (i % 2) === 0 ? 5 : 10;
                    var x = 5 + Math.cos(i * angle) * radius;
                    var y = 5 + Math.sin(i * angle) * radius;
                    starPoints.push([x, y]);
                }
                return starPoints;
            });
        };

        /**
         * Removes the success star
         */
        AudigameBlock.prototype.removeSuccessStar = function () {
            if (this._d3SuccessStar !== null) {
                this._d3SuccessStar.remove();
                this._d3SuccessStar = null;
            }
        };

        /**
         * RenderBlock factory
         * @override
         */
        AudigameBlock.buildRenderBlock = function () {
            return dudeGraph.RenderBlock.buildRenderBlock.apply(this, arguments);
        };

        DUDE_GRAPH_RENDER_BLOCK_TYPES.push({"renderBlock": "Start", "type": AudigameBlock});
        DUDE_GRAPH_RENDER_BLOCK_TYPES.push({"renderBlock": "Step", "type": AudigameBlock});
        DUDE_GRAPH_RENDER_BLOCK_TYPES.push({"renderBlock": "End", "type": AudigameBlock});
    })();
})();

// TODO: renderer API
dudeGraph.Renderer.defaultConfig.typeColors["Success"] = "#f1c40f";