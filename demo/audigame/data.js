const DUDE_GRAPH_MODELS = [
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
            "name": "Conditions",
            "items": [
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
    }
];
const DUDE_GRAPH_DEFAULT_GRAPH_DATA = {"blocks":[{"blockType":"Start","blockId":"3ac0-bbf6-4485-0717-1691-7cf1b314ccd9","blockName":"Start","blockOutputs":[{"pointType":"Stream","pointName":"first","pointValueType":"Stream","pointValue":null,"pointTemplate":null,"pointSingleConnection":true},{"pointType":"Stream","pointName":"second","pointValueType":"Stream","pointValue":null,"pointTemplate":null,"pointSingleConnection":true}],"blockInputs":[{"pointType":"Point","pointName":"text","pointValueType":"String","pointValue":null,"pointTemplate":null,"pointSingleConnection":true},{"pointType":"Point","pointName":"timer","pointValueType":"Number","pointValue":5,"pointTemplate":null,"pointSingleConnection":true},{"pointType":"Point","pointName":"sound","pointValueType":"Resource","pointValue":null,"pointTemplate":null,"pointSingleConnection":true},{"pointType":"Point","pointName":"cover","pointValueType":"Resource","pointValue":null,"pointTemplate":null,"pointSingleConnection":true}],"blockTemplates":{}},{"blockType":"Step","blockId":"3ac0-fd39-9c9a-2173-db42-3f68358d07b5","blockName":"Step","blockOutputs":[{"pointType":"Stream","pointName":"first","pointValueType":"Stream","pointValue":null,"pointTemplate":null,"pointSingleConnection":true},{"pointType":"Stream","pointName":"second","pointValueType":"Stream","pointValue":null,"pointTemplate":null,"pointSingleConnection":true}],"blockInputs":[{"pointType":"Stream","pointName":"in","pointValueType":"Stream","pointValue":null,"pointTemplate":null,"pointSingleConnection":true},{"pointType":"Point","pointName":"choice","pointValueType":"String","pointValue":null,"pointTemplate":null,"pointSingleConnection":true},{"pointType":"Point","pointName":"text","pointValueType":"String","pointValue":null,"pointTemplate":null,"pointSingleConnection":true},{"pointType":"Point","pointName":"timer","pointValueType":"Number","pointValue":5,"pointTemplate":null,"pointSingleConnection":true},{"pointType":"Point","pointName":"sound","pointValueType":"Resource","pointValue":null,"pointTemplate":null,"pointSingleConnection":true},{"pointType":"Point","pointName":"cover","pointValueType":"Resource","pointValue":null,"pointTemplate":null,"pointSingleConnection":true}],"blockTemplates":{}},{"blockType":"End","blockId":"3ac0-a711-5c72-3cbb-1b08-922bc8349241","blockName":"End","blockOutputs":[],"blockInputs":[{"pointType":"Stream","pointName":"in","pointValueType":"Stream","pointValue":null,"pointTemplate":null,"pointSingleConnection":true},{"pointType":"Point","pointName":"choice","pointValueType":"String","pointValue":null,"pointTemplate":null,"pointSingleConnection":true},{"pointType":"Point","pointName":"text","pointValueType":"String","pointValue":null,"pointTemplate":null,"pointSingleConnection":true},{"pointType":"Point","pointName":"sound","pointValueType":"Resource","pointValue":null,"pointTemplate":null,"pointSingleConnection":true},{"pointType":"Point","pointName":"cover","pointValueType":"Resource","pointValue":null,"pointTemplate":null,"pointSingleConnection":true}],"blockTemplates":{}},{"blockType":"Format","blockId":"b2cb-9e34-81f6-d812-ba90-daf8548f4fbc","blockName":"format","blockOutputs":[{"pointType":"Point","pointName":"value","pointValueType":"String","pointValue":null,"pointTemplate":null,"pointSingleConnection":true}],"blockInputs":[{"pointType":"Point","pointName":"format","pointValueType":"String","pointValue":"{{name}} est un {{race}}","pointTemplate":null,"pointSingleConnection":true},{"pointType":"Point","pointName":"name","pointValueType":"String","pointValue":"Denis","pointTemplate":null,"pointSingleConnection":true},{"pointType":"Point","pointName":"race","pointValueType":"String","pointValue":null,"pointTemplate":null,"pointSingleConnection":true}],"blockTemplates":{}},{"blockType":"Expression","blockId":"b2cb-e014-bff8-ca37-cde3-005745caedb7","blockName":"expression","blockOutputs":[{"pointType":"Point","pointName":"value","pointValueType":"Number","pointValue":null,"pointTemplate":null,"pointSingleConnection":true}],"blockInputs":[{"pointType":"Point","pointName":"expression","pointValueType":"String","pointValue":"a + b","pointTemplate":null,"pointSingleConnection":true},{"pointType":"Point","pointName":"a","pointValueType":"Number","pointValue":32,"pointTemplate":null,"pointSingleConnection":true},{"pointType":"Point","pointName":"b","pointValueType":"Number","pointValue":64,"pointTemplate":null,"pointSingleConnection":true}],"blockTemplates":{}}],"connections":[{"connectionOutputPoint":"first","connectionOutputBlock":"3ac0-bbf6-4485-0717-1691-7cf1b314ccd9","connectionInputPoint":"in","connectionInputBlock":"3ac0-fd39-9c9a-2173-db42-3f68358d07b5"},{"connectionOutputPoint":"first","connectionOutputBlock":"3ac0-fd39-9c9a-2173-db42-3f68358d07b5","connectionInputPoint":"in","connectionInputBlock":"3ac0-a711-5c72-3cbb-1b08-922bc8349241"},{"connectionOutputPoint":"value","connectionOutputBlock":"b2cb-9e34-81f6-d812-ba90-daf8548f4fbc","connectionInputPoint":"choice","connectionInputBlock":"3ac0-fd39-9c9a-2173-db42-3f68358d07b5"},{"connectionOutputPoint":"value","connectionOutputBlock":"b2cb-e014-bff8-ca37-cde3-005745caedb7","connectionInputPoint":"race","connectionInputBlock":"b2cb-9e34-81f6-d812-ba90-daf8548f4fbc"}]};
const DUDE_GRAPH_DEFAULT_RENDERER_DATA = {"zoom":{"translate":[1229.3888888888891,369.05555555555554],"scale":1.4444444444444446},"blocks":[{"id":"3ac0-bbf6-4485-0717-1691-7cf1b314ccd9","block":"3ac0-bbf6-4485-0717-1691-7cf1b314ccd9","description":"Start","position":[-510,-185],"parent":null},{"id":"3ac0-fd39-9c9a-2173-db42-3f68358d07b5","block":"3ac0-fd39-9c9a-2173-db42-3f68358d07b5","description":"Step","position":[-221,-28.5],"parent":null},{"id":"3ac0-a711-5c72-3cbb-1b08-922bc8349241","block":"3ac0-a711-5c72-3cbb-1b08-922bc8349241","description":"End","position":[54,-219],"parent":null},{"id":"b2cb-9e34-81f6-d812-ba90-daf8548f4fbc","block":"b2cb-9e34-81f6-d812-ba90-daf8548f4fbc","description":"format","position":[-433,75],"parent":null},{"id":"b2cb-e014-bff8-ca37-cde3-005745caedb7","block":"b2cb-e014-bff8-ca37-cde3-005745caedb7","description":"expression","position":[-462,223],"parent":null}],"groups":[],"connections":[{"connectionIndex":0,"outputName":"first","outputRendererBlockId":"3ac0-bbf6-4485-0717-1691-7cf1b314ccd9","inputName":"in","inputRendererBlockId":"3ac0-fd39-9c9a-2173-db42-3f68358d07b5"},{"connectionIndex":1,"outputName":"first","outputRendererBlockId":"3ac0-fd39-9c9a-2173-db42-3f68358d07b5","inputName":"in","inputRendererBlockId":"3ac0-a711-5c72-3cbb-1b08-922bc8349241"},{"connectionIndex":2,"outputName":"value","outputRendererBlockId":"b2cb-9e34-81f6-d812-ba90-daf8548f4fbc","inputName":"choice","inputRendererBlockId":"3ac0-fd39-9c9a-2173-db42-3f68358d07b5"},{"connectionIndex":3,"outputName":"value","outputRendererBlockId":"b2cb-e014-bff8-ca37-cde3-005745caedb7","inputName":"race","inputRendererBlockId":"b2cb-9e34-81f6-d812-ba90-daf8548f4fbc"}]};
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