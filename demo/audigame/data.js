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
    }
];
const DUDE_GRAPH_DEFAULT_GRAPH_DATA = {};
const DUDE_GRAPH_DEFAULT_RENDERER_DATA = {};
const DUDE_GRAPH_BLOCK_TYPES = [];
const DUDE_GRAPH_POINT_TYPES = [
    {"point": "Stream", "type": dudeGraph.Stream}
];
const DUDE_GRAPH_RENDER_BLOCK_TYPES = [];

(function Blocks() {
    (function Start() {
        /**
         * This is like function however, it takes a stream in input and output.
         * In code it would represent function separated by semicolons.
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
         * This is like function however, it takes a stream in input and output.
         * In code it would represent function separated by semicolons.
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
         * This is like function however, it takes a stream in input and output.
         * In code it would represent function separated by semicolons.
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
         *
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