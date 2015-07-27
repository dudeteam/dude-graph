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
            return cgBlock.cgInputs.concat(cgBlock.cgOutputs);
        }.bind(this))
        .enter()
        .append("svg:g")
            .attr("class", "cg-point")
            .append("svg:text")
                .text(function (cgPoint) {
                    return cgPoint.cgName;
                });
};