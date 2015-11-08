/**
 * Creates d3Points
 * @param {d3.selection} d3Block - The svg group which will contains the d3Points of the current block
 * @private
 */
dudeGraph.Renderer.prototype._createD3Points = function (d3Block) {
    var renderer = this;
    var createdD3Points = d3Block
        .selectAll(".dude-graph-output, .dude-graph-input")
        .data(function (rendererBlock) {
            return rendererBlock.rendererPoints;
        }, function (rendererPoint) {
            return rendererPoint.cgPoint.cgName;
        })
        .enter()
        .append("svg:g")
        .each(function () {
            renderer._createD3PointShapes(d3.select(this));
        });
    this._classD3Points(createdD3Points)
        .append("svg:text")
        .attr("alignment-baseline", "middle")
        .attr("text-anchor", function (rendererPoint) {
            return rendererPoint.isOutput ? "end" : "start";
        })
        .text(function (rendererPoint) {
            return rendererPoint.cgPoint.cgName;
        });
    this._updateSelectedD3Points(createdD3Points);
};

/**
 * Updates the selected d3Points
 * @param {d3.selection} updatedD3Points
 * @private
 */
dudeGraph.Renderer.prototype._updateSelectedD3Points = function (updatedD3Points) {
    var renderer = this;
    this._classD3Points(updatedD3Points)
        .attr("transform", function (rendererPoint) {
            return "translate(" + renderer._getRendererPointPosition(rendererPoint, true) + ")";
        });
    updatedD3Points
        .select("text")
        .attr("transform", function (rendererPoint) {
            if (rendererPoint.isOutput) {
                return "translate(" + [-renderer._config.point.radius * 2 - renderer._config.block.padding] + ")";
            } else {
                return "translate(" + [renderer._config.point.radius * 2 + renderer._config.block.padding] + ")";
            }
        });
};

/**
 * Creates the d3PointShapes
 * @param {d3.selection} d3Point
 * @returns {d3.selection}
 * @private
 */
dudeGraph.Renderer.prototype._createD3PointShapes = function (d3Point) {
    var renderer = this;
    d3Point
        .selectAll(".cg-point-shape")
        .data(d3Point.data(), function (rendererPoint) {
            return rendererPoint.cgPoint.cgName;
        })
        .enter()
        .append("svg:path")
        .classed("cg-point-shape", true)
        .attr("d", function (rendererPoint) {
            var r = renderer._config.point.radius;
            if (rendererPoint.cgPoint.pointType === "Stream") {
                return "M " + -r + " " + -r * 1.5 + " L " + -r + " " + r * 1.5 + " L " + r + " " + 0 + " Z";
            } else {
                return "M 0,0m " + -r + ", 0a " + [r, r] + " 0 1,0 " + r * 2 + ",0a " + [r, r] + " 0 1,0 " + -(r * 2) + ",0";
            }
        })
        .call(renderer._removeRendererConnectionBehavior())
        .call(renderer._dragRendererConnectionBehavior());
};

/**
 * Sets the proper class attributes of the given d3Points
 * @param {d3.selection} d3Points
 * @private
 */
dudeGraph.Renderer.prototype._classD3Points = function (d3Points) {
    d3Points.attr("class", function (rendererPoint) {
        return [
            rendererPoint.cgPoint.isOutput ? "dude-graph-output" : "dude-graph-input",
            "dude-graph-point-" + _.kebabCase(rendererPoint.cgPoint.pointType),
            "dude-graph-type-" + _.kebabCase(rendererPoint.cgPoint.cgValueType),
            rendererPoint.cgPoint.empty() ? "dude-graph-empty" : ""
        ].join(" ");
    });
    return d3Points;
};