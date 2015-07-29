/**
 * Creates renderer groups
 * @private
 */
cg.Renderer.prototype._createRendererGroups = function () {
    var createdRendererGroups = this._groupsSvg
        .selectAll(".cg-group")
        .data(this._rendererGroups, function (rendererGroup) {
            rendererGroup.size = rendererGroup.size || [100, 100];
            return rendererGroup.id;
        })
        .enter()
        .append("svg:g")
        .attr("id", function (rendererGroup) {
            return this._getUniqueElementId(rendererGroup);
        }.bind(this))
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
        .attr("transform", function (rendererGroup) {
            return "translate(" + rendererGroup.position + ")";
        });
    updatedRendererGroups
        .select("rect")
        .attr("rx", 5)
        .attr("ry", 5)
        .attr("width", function (rendererGroup) {
            return rendererGroup.size[0];
        })
        .attr("height", function (rendererGroup) {
            return rendererGroup.size[1];
        });
    updatedRendererGroups
        .select("text")
        .text(function (rendererGroup) {
            return rendererGroup.description;
        })
        .attr("class", "cg-title")
        .attr("text-anchor", "middle")
        .attr("transform", function (rendererGroup) {
            return "translate(" + [rendererGroup.size[0] / 2, 15] + ")";
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