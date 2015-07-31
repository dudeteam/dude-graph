/**
 * Creates renderer groups
 * @private
 */
cg.Renderer.prototype._createRendererGroups = function () {
    var createdRendererGroups = this._groupsSvg
        .selectAll(".cg-group")
        .data(this._rendererGroups, function (rendererGroup) {
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
    this._updateSelectedRendererGroups(this._groupsSvg.selectAll(".cg-group"));
};

/**
 * Updates selected renderer groups
 * @param updatedRendererGroups {d3.selection}
 * @private
 */
cg.Renderer.prototype._updateSelectedRendererGroups = function (updatedRendererGroups) {
    var renderer = this;
    updatedRendererGroups
        .each(function (rendererGroup) {
            if (rendererGroup.children) {
                var size = renderer._getRendererNodesBoundingBox(rendererGroup.children);
                rendererGroup.position = [size[0][0] - renderer._config.group.padding, size[0][1] - renderer._config.group.padding];
                rendererGroup.size = [size[1][0] - size[0][0] + renderer._config.group.padding * 2, size[1][1] - size[0][1] + renderer._config.group.padding * 2];
            }
        })
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