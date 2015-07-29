/**
 * Creates renderer points.
 * @param parentSvg The svg group which will contains the renderer points of the current block
 * @private
 */
cg.Renderer.prototype._createRendererPoints = function (parentSvg) {
    parentSvg
        .selectAll(".cg-point")
        .data(function (block) {
            var cgBlock = this._cgGraph.blockById(block.id);
            return cgBlock.cgInputs; // TODO outputs
        }.bind(this))
        .enter()
        .append("svg:g")
            .attr("class", "cg-point")
            .append("svg:text")
                .attr("transform", function (cgPoint, index) {
                    console.log(index);
                    return "translate(" + [0, index * 20 + 40] + ")";
                })
                .text(function (cgPoint) {
                    return cgPoint.cgName;
                });
};