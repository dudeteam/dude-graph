/**
 * Creates d3Points
 * @param d3Block The svg group which will contains the d3Points of the current block
 * @private
 */
cg.Renderer.prototype._createD3Points = function (d3Block) {
    var renderer = this;
    var d3Points = d3Block
        .selectAll(".cg-input")
        .data(function (rendererBlock) {
            return rendererBlock.rendererPoints;
        }.bind(this))
        .enter()
        .append("svg:g")
        .attr("transform", function (rendererPoint) {
            if (rendererPoint.isOutput) {
                return "translate(" + [
                        rendererPoint.rendererBlock.size[0] - renderer._config.block.padding,
                        rendererPoint.index * renderer._config.point.height + renderer._config.block.header
                    ] + ")";
            } else {
                return "translate(" + [
                        renderer._config.block.padding,
                        rendererPoint.index * renderer._config.point.height + renderer._config.block.header
                    ] + ")";
            }
        })
        .attr("class", function (rendererPoint) {
            return "cg-" + (rendererPoint.isOutput ? "output" : "input");
        });
    d3Points
        .append("svg:text")
        .attr("alignment-baseline", "middle")
        .attr("text-anchor", function (rendererPoint) {
            return rendererPoint.isOutput ? "end" : "start";
        })
        .attr("transform", function (rendererPoint) {
            if (rendererPoint.isOutput) {
                return "translate(" + [-renderer._config.point.radius * 2 - renderer._config.block.padding] + ")";
            } else {
                return "translate(" + [renderer._config.point.radius * 2 + renderer._config.block.padding] + ")";
            }
        })
        .text(function (rendererPoint) {
            return rendererPoint.cgPoint.cgName;
        });
    this._createD3PointsCircle(d3Points);
};

/**
 *
 * @param point
 * @returns {*|{pattern, lookbehind, inside}|Array|Object|string}
 * @private
 */
cg.Renderer.prototype._createD3PointsCircle = function (point) {
    var renderer = this;
    return point
        .each(function (rendererPoint) {
            d3.select(this)
                .classed("cg-empty", function (rendererPoint) {
                    return rendererPoint.cgPoint.empty();
                });
            var node = null;
            switch (pandora.typename(rendererPoint.cgPoint)) {
                case "Stream":
                    var r = renderer._config.point.radius;
                    node = d3.select(this)
                        .classed("cg-stream", true)
                        .append("svg:path")
                        .attr({
                            "class": "circle",
                            "d": ["M " + -r + " " + -r * 2 + " L " + -r + " " + r * 2 + " L " + r + " " + 0 + " Z"]
                        });
                    break;
                default:
                    node = d3.select(this)
                        .append("svg:circle")
                        .attr("r", renderer._config.point.radius);
            }
            node
                .attr("transform", function () {
                    return "translate(" + [
                            (rendererPoint.isOutput ? -1 : 1) * renderer._config.point.radius, 0] + ")";
                });
        });
};

/**
 * Returns the cgPoint position
 * @param rendererPoint {cg.RendererPoint}
 * @return {[Number, Number]}
 * @private
 */
cg.Renderer.prototype._getRendererPointPosition = function (rendererPoint) {
    if (rendererPoint.isOutput) {
        return [
            rendererPoint.rendererBlock.position[0] + rendererPoint.rendererBlock.size[0] - this._config.block.padding,
            rendererPoint.rendererBlock.position[1] + this._config.block.header + this._config.point.height * rendererPoint.index
        ];
    } else {
        return [
            rendererPoint.rendererBlock.position[0] + this._config.block.padding,
            rendererPoint.rendererBlock.position[1] + this._config.block.header + this._config.point.height * rendererPoint.index
        ];
    }
};

/**
 * Returns the cgPoint position
 * @param cgPoint
 * @return {[Number, Number]}
 * @private
 */
cg.Renderer.prototype._getCgPointPosition = function (cgPoint) {
    var rendererBlock = this._getRendererBlockById(cgPoint.cgBlock.cgId);
    var index = 0;
    if (cgPoint.isOutput) {
        index = cgPoint.cgBlock.cgOutputs.indexOf(cgPoint.cgBlock.outputByName(cgPoint.cgName));
        return [
            rendererBlock.position[0] + rendererBlock.size[0] - this._config.block.padding,
            rendererBlock.position[1] + this._config.block.header + this._config.point.height * index
        ];
    } else {
        index = cgPoint.cgBlock.cgInputs.indexOf(cgPoint.cgBlock.inputByName(cgPoint.cgName));
        return [
            rendererBlock.position[0] + this._config.block.padding,
            rendererBlock.position[1] + this._config.block.header + this._config.point.height * index
        ];
    }
};