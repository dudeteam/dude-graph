/**
 * Creates d3Points
 * @param {d3.selection} d3Block - The svg group which will contains the d3Points of the current block
 * @private
 */
cg.Renderer.prototype._createD3Points = function (d3Block) {
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
    createdD3Points
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
cg.Renderer.prototype._updateSelectedD3Points = function (updatedD3Points) {
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
cg.Renderer.prototype._createD3PointShapes = function (d3Point) {
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
            if (pandora.typename(rendererPoint.cgPoint) === "Stream") {
                return ["M " + -r + " " + -r * 1.5 + " L " + -r + " " + r * 1.5 + " L " + r + " " + 0 + " Z"];
            } else {
                return ["M 0, 0", "m " + -r + ", 0", "a " + [r, r] + " 0 1,0 " + r * 2 + ",0", "a " + [r, r] + " 0 1,0 " + -(r * 2) + ",0"];
            }
        })
        .call(renderer._removeRendererConnectionBehavior())
        .call(renderer._dragRendererConnectionBehavior());
};