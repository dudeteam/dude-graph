cg.Variable = (function () {

    /**
     *
     * @extends {cg.Block}
     * @param {cg.Graph} cgGraph
     * @param {Object} data
     * @constructor
     */
    var Variable = pandora.class_("Variable", cg.Block, function (cgGraph, data) {
        cg.Block.call(this, cgGraph, {
            cgId: data.cgId,
            cgName: data.cgName,
            cgOutputs: [
                {
                    "cgType": "Point",
                    "cgName": "value",
                    "cgValueType": data.cgValueType,
                    "cgMaxConnections": Infinity
                }
            ]
        });

        /**
         * The type of this variable, the block will return a point of this type.
         * @type {String}
         * @private
         */
        this._cgValueType = data.cgValueType;
        Object.defineProperty(this, "cgValueType", {
            get: function () {
                return this._cgValueType;
            }.bind(this)
        });

        /**
         * The current value of the Variable.
         * @type {*}
         * @private
         */
        this._cgValue = data.cgValue;
        Object.defineProperty(this, "cgValue", {
            get: function () {
                return this._cgValue;
            }.bind(this),
            set: function (value) {
                this._cgValue = value;
                this.cgOutputs[0].cgValue = value;
            }.bind(this)
        });

    });

    Variable.rendererBlockCreator = function (renderer) {
        var d3Block = d3.select(this);
        d3Block
            .append("svg:rect")
            .attr("rx", function () {
                return renderer._config.block.header / 2;
            })
            .attr("ry", function () {
                return renderer._config.block.header / 2;
            });
        d3Block
            .append("svg:text")
            .classed("cg-title", true)
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "text-before-edge");
        d3Block
            .append("svg:g")
            .classed("cg-points", true);
        var createdD3Points = d3Block
            .selectAll(".cg-output, .cg-input")
            .data(function (rendererBlock) {
                return rendererBlock.rendererPoints;
            }, function (rendererPoint) {
                return rendererPoint.cgPoint.cgName;
            })
            .enter()
            .append("svg:g")
            .attr("class", function (rendererPoint) {
                return "cg-" + (rendererPoint.isOutput ? "output" : "input");
            })
            .each(function () {
                renderer._createD3PointShapes(d3.select(this));
            });
        Variable.rendererPointUpdater.call(renderer, createdD3Points);
    };

    Variable.rendererBlockUpdater = function (renderer) {
        var d3Block = d3.select(this);
        d3Block
            .select("text")
            .text(function (rendererBlock) {
                return rendererBlock.cgBlock.cgName;
            });
        d3Block
            .each(function (rendererBlock) {
                return renderer._computeRendererBlockSize(rendererBlock);
            });
        d3Block
            .attr("transform", function (rendererBlock) {
                return "translate(" + rendererBlock.position + ")";
            });
        d3Block
            .select("rect")
            .attr("width", function (rendererBlock) {
                return rendererBlock.size[0];
            })
            .attr("height", function (rendererBlock) {
                return renderer._config.block.header;
            });
        d3Block
            .select("text")
            .attr("transform", function (block) {
                return "translate(" + [block.size[0] / 2, renderer._config.block.padding] + ")";
            });
        Variable.rendererPointUpdater.call(renderer, d3Block.select(".cg-points").selectAll(".cg-output, .cg-input"));
    };

    Variable.rendererPointUpdater = function (updatedD3Points) {
        var renderer = this;
        updatedD3Points
            .classed("cg-empty", function (rendererPoint) {
                return renderer._getRendererPointRendererConnections(rendererPoint).length === 0;
            })
            .classed("cg-stream", function (rendererPoint) {
                return pandora.typename(rendererPoint.cgPoint) === "Stream";
            })
            .attr("transform", function (rendererPoint) {
                return "translate(" + renderer._getRendererPointPosition(rendererPoint, true) + ")";
            });
    };

    Variable.pointPositionGetter = function (rendererPoint, offsetX, offsetY) {
        return [
            offsetX + rendererPoint.rendererBlock.size[0] - this._config.block.padding,
            offsetY + this._config.block.header / 2
        ];
    };

    return Variable;

})();
