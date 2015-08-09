/**
 * Creates d3Points
 * @param d3Block {d3.selection} The svg group which will contains the d3Points of the current block
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
    this._createD3PointsShapes(d3Points);
};

/**
 * Creates the input/output shapes
 * @param point
 * @returns {d3.selection}
 * @private
 */
cg.Renderer.prototype._createD3PointsShapes = function (point) {
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
                })
                .call(
                d3.behavior.drag()
                    .on("dragstart", function () {
                        d3.event.sourceEvent.preventDefault();
                        d3.event.sourceEvent.stopPropagation();
                    })
                    .on("dragend", function () {
                        var position = renderer._getRelativePosition([d3.event.sourceEvent.clientX, d3.event.sourceEvent.clientY]);
                        var rendererPoint = renderer._getNearestRendererPoint(position);
                        console.log(position, rendererPoint ? rendererPoint.cgPoint.cgName : null);
                    })
            );
        });
};