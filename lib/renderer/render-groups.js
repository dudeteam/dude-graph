/**
 * Creates renderer groups
 * @private
 */
cg.Renderer.prototype._createRendererGroups = function () {
    var createdRendererGroups = this._groupsSvg
        .selectAll(".cg-group")
        .data(this._rendererGroups, function (group) {
            return group.id;
        })
        .enter()
        .append("svg:g")
        .attr("id", function (group) {
            return "cg-group-" + group.id;
        })
        .attr("class", "cg-group")
        .call(this._createDragBehavior());
    createdRendererGroups
        .append("svg:rect");
    createdRendererGroups
        .append("svg:text");
    this._updateRendererGroups();
};

/**
 * Updates renderer groups
 * @private
 */
cg.Renderer.prototype._updateRendererGroups = function () {
    var updatedRendererGroups = this._groupsSvg
        .selectAll(".cg-group");
    updatedRendererGroups
        .select("g")
        .attr("transform", function (cgGroup) {
            return "translate(" + cgGroup.position + ")";
        });
    updatedRendererGroups
        .select("rect")
        .attr("rx", 5)
        .attr("ry", 5)
        .attr("width", function (cgGroup) {
            return cgGroup.size[0];
        })
        .attr("height", function (cgGroup) {
            return cgGroup.size[1];
        });
    updatedRendererGroups
        .select("text")
        .text(function (cgGroup) {
            return cgGroup.description;
        })
        .attr("class", "cg-title")
        .attr("text-anchor", "middle")
        .attr("transform", function (cgGroup) {
            return "translate(" + [cgGroup.size[0] / 2, 15] + ")";
        });
};

/**
 * Removes renderer groups
 * @private
 */
cg.Renderer.prototype._removeRendererGroups = function () {
    var removedRendererGroups = this._groupsSvg
        .selectAll(".cg-group")
        .exit()
        .remove();
};