/**
 * Creates renderer points.
 * @param parentSvg The svg group which will contains the renderer points of the current block
 * @private
 */
cg.Renderer.prototype._createRendererPoints = function (parentSvg) {
    var renderer = this;
    var inputs = parentSvg
        .selectAll(".cg-input")
        .data(function (block) {
            var cgBlock = this._cgGraph.blockById(block.id);
            return cgBlock.cgInputs;
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
    inputs
        .append("svg:circle")
        .attr("r", renderer._config.point.radius)
        .attr("transform", "translate(" + [renderer._config.point.radius, 0] + ")");
    var outputs = parentSvg
        .selectAll(".cg-output")
        .data(function (block) {
            var cgBlock = this._cgGraph.blockById(block.id);
            return cgBlock.cgOutputs;
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
    outputs
        .append("svg:circle")
            .attr("r", renderer._config.point.radius)
            .attr("transform", "translate(" + [-renderer._config.point.radius, 0] + ")");
};