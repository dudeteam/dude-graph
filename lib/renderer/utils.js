/**
 * Returns an unique HTML usable id for the given rendererNode
 * @param rendererNode {{id: String, type: "group", parent: {type: "group"}|null, position: [Number, Number]}|{id: String, type: "block", parent: {type: "group"}|null, cgBlock: cg.Block, position: [Number, Number]}}
 * @param hashtag {Boolean?}
 * @return {String}
 * @private
 */
cg.Renderer.prototype._getUniqueElementId = function (rendererNode, hashtag) {
    return pandora.formatString("{0}cg-{1}-{2}", hashtag ? "#" : "", rendererNode.type, rendererNode.id);
};