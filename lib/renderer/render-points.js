/**
 * Creates d3Points
 * @param parentSvg The svg group which will contains the d3Points of the current block
 * @private
 */
cg.Renderer.prototype._createRendererPoints = function (parentSvg) {
    var renderer = this;
    var inputs = parentSvg
        .selectAll(".cg-input")
        .data(function (rendererBlock) {
            return rendererBlock.cgBlock.cgInputs;
        }.bind(this))
        .enter()
        .append("svg:g")
        .attr("transform", function (cgPoint, index) {
            return "translate(" + [
                    renderer._config.block.padding,
                    index * renderer._config.point.height + renderer._config.block.header
                ] + ")";
        })
        .attr("class", "cg-input");
    inputs
        .append("svg:text")
        .attr("alignment-baseline", "middle")
        .attr("transform", "translate(" + [renderer._config.point.radius * 2 + renderer._config.block.padding] + ")")
        .text(function (cgPoint) {
            return cgPoint.cgName;
        });
    this._createRendererPointsCircle(inputs);
    var outputs = parentSvg
        .selectAll(".cg-output")
        .data(function (rendererBlock) {
            return rendererBlock.cgBlock.cgOutputs;
        }.bind(this))
        .enter()
        .append("svg:g")
        .attr("class", "cg-output")
        .attr("text-anchor", "end")
        .attr("transform", function (cgPoint, index) {
            return "translate(" + [
                    d3.select(this.parentNode.parentNode).datum().size[0] - renderer._config.block.padding,
                    index * renderer._config.point.height + renderer._config.block.header
                ] + ")";
        });
    outputs
        .append("svg:text")
        .attr("alignment-baseline", "middle")
        .attr("transform", "translate(" + [-renderer._config.point.radius * 2 - renderer._config.block.padding] + ")")
        .text(function (cgPoint) {
            return cgPoint.cgName;
        });
    this._createRendererPointsCircle(outputs);
};

/**
 *
 * @param point
 * @returns {*|{pattern, lookbehind, inside}|Array|Object|string}
 * @private
 */
cg.Renderer.prototype._createRendererPointsCircle = function (point) {
    var renderer = this;
    return point
        .each(function (cgPoint) {
            var node = null;
            switch (pandora.typename(cgPoint)) {
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
            node.attr("transform", function () {
                return "translate(" + [
                        (cgPoint.isOutput ? -1 : 1) * renderer._config.point.radius, 0] + ")";
            });
        });
};