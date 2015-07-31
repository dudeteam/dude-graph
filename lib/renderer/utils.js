/**
 * Returns an unique HTML usable id for the given rendererNode
 * @param rendererNode {{id: String, type: "group", parent: {type: "group"}|null, position: [Number, Number]}|{id: String, type: "block", parent: {type: "group"}|null, cgBlock: cg.Block, position: [Number, Number]}}
 * @param hashtag {Boolean?} True to include the hashtag to select, False otherwise
 * @return {String}
 * @private
 */
cg.Renderer.prototype._getUniqueElementId = function (rendererNode, hashtag) {
    return pandora.formatString("{0}cg-{1}-{2}", hashtag ? "#" : "", rendererNode.type, rendererNode.id);
};

/**
 * Returns a selection of d3Nodes from renderer nodes
 * @param rendererNodes {Array<{id: String, type: "group", parent: {type: "group"}|null, position: [Number, Number]}|{id: String, type: "block", parent: {type: "group"}|null, cgBlock: cg.Block, position: [Number, Number]}>}
 * @returns {d3.selection}
 * @private
 */
cg.Renderer.prototype._getD3NodesFromRendererNodes = function (rendererNodes) {
    var groupedSelectionIds = d3.set();
    pandora.forEach(rendererNodes, function (rendererNode) {
        groupedSelectionIds.add(this._getUniqueElementId(rendererNode, true));
    }.bind(this));
    return d3.selectAll(groupedSelectionIds.values().join(", "));
};