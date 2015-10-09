/**
 * Creates d3Groups with the existing rendererGroups
 * @private
 */
dudeGraph.Renderer.prototype._createD3Groups = function () {
    var createdD3Groups = this.d3Groups
        .data(this._rendererGroups, function (rendererGroup) {
            return rendererGroup.id;
        })
        .enter()
        .append("svg:g")
        .attr("id", function (rendererGroup) {
            return this._getRendererNodeUniqueID(rendererGroup);
        }.bind(this))
        .attr("class", "dude-graph-group")
        .call(this._dragRendererNodeBehavior())
        .call(this._removeRendererNodeFromParentBehavior());
    createdD3Groups
        .append("svg:rect")
        .attr("rx", this._config.group.borderRadius || 0)
        .attr("ry", this._config.group.borderRadius || 0);
    createdD3Groups
        .append("svg:text")
        .attr("class", "dude-graph-title")
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "text-before-edge");
    this._updateD3Groups();
};

/**
 * Updates all d3Groups
 * @private
 */
dudeGraph.Renderer.prototype._updateD3Groups = function () {
    this._updateSelectedD3Groups(this.d3Groups);
};

/**
 * Updates selected d3Groups
 * @param {d3.selection} updatedD3Groups
 * @private
 */
dudeGraph.Renderer.prototype._updateSelectedD3Groups = function (updatedD3Groups) {
    var renderer = this;
    updatedD3Groups
        .select("text")
        .text(function (rendererGroup) {
            return rendererGroup.description;
        });
    updatedD3Groups
        .each(function (rendererGroup) {
            return renderer._computeRendererGroupPositionAndSize(rendererGroup);
        });
    updatedD3Groups
        .attr("transform", function (rendererGroup) {
            return "translate(" + rendererGroup.position + ")";
        });
    updatedD3Groups
        .select("rect")
        .attr("width", function (rendererGroup) {
            return rendererGroup.size[0];
        })
        .attr("height", function (rendererGroup) {
            return rendererGroup.size[1];
        });
    updatedD3Groups
        .select("text")
        .attr("transform", function (rendererGroup) {
            return "translate(" + [rendererGroup.size[0] / 2, renderer._config.group.padding] + ")";
        });
};

/**
 * Removes d3Groups when rendererGroups are removed
 * @private
 */
dudeGraph.Renderer.prototype._removeD3Groups = function () {
    var removedD3Groups = this.d3Groups
        .data(this._rendererGroups, function (rendererGroup) {
            return rendererGroup.id;
        })
        .exit()
        .remove();
};