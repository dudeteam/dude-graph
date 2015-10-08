//
// Copyright (c) 2015 DudeTeam. All rights reserved.
//

/**
 *
 * @extends {dudeGraph.Block}
 * @param {dudeGraph.Graph} cgGraph
 * @param {Object} data
 * @constructor
 */
dudeGraph.Variable = function (cgGraph, data) {
    dudeGraph.Block.call(this, cgGraph, data, "Variable");
    if (!(this.outputByName("value") instanceof dudeGraph.Point)) {
        throw new Error("Variable `" + this.cgId + "` must have an output `value` of type `Point`");
    }

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

};

/**
 * @extends {dudeGraph.Block}
 */
dudeGraph.Variable.prototype = _.create(dudeGraph.Block.prototype, {
    "constructor": dudeGraph.Variable
});

/**
 *
 * @param renderer
 */
dudeGraph.Variable.rendererBlockCreator = function (renderer) {
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
    dudeGraph.Variable.rendererPointCreator.call(renderer, d3Block);
};

/**
 *
 * @param d3Block
 */
dudeGraph.Variable.rendererPointCreator = function (d3Block) {
    var renderer = this;
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
    dudeGraph.Variable.rendererPointUpdater.call(renderer, createdD3Points);
};

/**
 *
 * @param renderer
 */
dudeGraph.Variable.rendererBlockUpdater = function (renderer) {
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
    dudeGraph.Variable.rendererPointUpdater.call(renderer, d3Block.select(".cg-points").selectAll(".cg-output, .cg-input"));
};

/**
 *
 * @param updatedD3Points
 */
dudeGraph.Variable.rendererPointUpdater = function (updatedD3Points) {
    var renderer = this;
    updatedD3Points
        .classed("cg-empty", function (rendererPoint) {
            return rendererPoint.cgPoint.empty();
        })
        .classed("cg-stream", function (rendererPoint) {
            return pandora.typename(rendererPoint.cgPoint) === "Stream";
        })
        .attr("transform", function (rendererPoint) {
            return "translate(" + renderer._getRendererPointPosition(rendererPoint, true) + ")";
        });
};

/**
 *
 * @param rendererPoint
 * @param offsetX
 * @param offsetY
 * @returns {*[]}
 */
dudeGraph.Variable.pointPositionGetter = function (rendererPoint, offsetX, offsetY) {
    return [
        offsetX + rendererPoint.rendererBlock.size[0] - this._config.block.padding,
        offsetY + this._config.block.header / 2
    ];
};

/**
 * Variable factory
 * @param {dudeGraph.Graph} cgGraph
 * @param {Object} data
 */
dudeGraph.Variable.buildBlock = function (cgGraph, data) {
    return new Variable(cgGraph, _.merge(data, {
        "cgOutputs": [
            {
                "cgType": "Point",
                "cgName": "value",
                "cgValueType": data.cgValueType,
                "singleConnection": false
            }
        ]
    }, dudeGraph.ArrayMerger));
};
