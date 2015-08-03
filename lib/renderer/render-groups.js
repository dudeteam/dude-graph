/**
 * Creates d3Groups with the existing rendererGroups
 * @private
 */
cg.Renderer.prototype._createD3Groups = function () {
    var createdD3Groups = this.d3Groups
        .data(this._rendererGroups, function (rendererGroup) {
            return rendererGroup.id;
        })
        .enter()
        .append("svg:g")
        .attr("id", function (rendererGroup) {
            return this._getRendererNodeUniqueID(rendererGroup);
        }.bind(this))
        .attr("class", "cg-group")
        .call(this._createDragBehavior());
    createdD3Groups
        .append("svg:rect");
    createdD3Groups
        .append("svg:text");
    this._updateD3Groups();
};

/**
 * Updates all d3Groups
 * @private
 */
cg.Renderer.prototype._updateD3Groups = function () {
    this._updateSelectedD3Groups(this.d3Groups);
};

/**
 * Updates selected d3Groups
 * @param updatedD3Groups {d3.selection}
 * @private
 */
cg.Renderer.prototype._updateSelectedD3Groups = function (updatedD3Groups) {
    var renderer = this;
    updatedD3Groups
        .attr("transform", function (rendererGroup) {
            return "translate(" + rendererGroup.position + ")";
        });
    updatedD3Groups
        .select("rect")
        .attr("rx", 5)
        .attr("ry", 5)
        .attr("width", function (rendererGroup) {
            return rendererGroup.size[0];
        })
        .attr("height", function (rendererGroup) {
            return rendererGroup.size[1];
        });
    updatedD3Groups
        .select("text")
        .text(function (rendererGroup) {
            return rendererGroup.description;
        })
        .attr("class", "cg-title")
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "text-before-edge")
        .attr("transform", function (rendererGroup) {
            return "translate(" + [rendererGroup.size[0] / 2, renderer._config.group.padding] + ")";
        });
};

/**
 * Removes d3Groups when rendererGroups are removed
 * @private
 */
cg.Renderer.prototype._removeD3Groups = function () {
    var removedD3Groups = this.d3Groups
        .exit()
        .remove();
};