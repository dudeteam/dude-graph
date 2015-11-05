/**
 * Saves the renderer
 * @returns {Object}
 */
dudeGraph.Renderer.prototype._save = function () {
    return {
        "zoom": {
            "translate": this._zoom.translate || [0, 0],
            "scale": this._zoom.scale || 1
        },
        "blocks": _.map(this._rendererBlocks, function (rendererBlock) {
            return {
                "id": rendererBlock.id,
                "cgBlock": rendererBlock.cgBlock.cgId,
                "position": rendererBlock.position,
                "parent": rendererBlock.parent ? rendererBlock.parent.id : null
            };
        }),
        "groups": _.map(this._rendererGroups, function (rendererGroup) {
            return {
                "id": rendererGroup.id,
                "description": rendererGroup.description,
                "position": rendererGroup.position,
                "parent": rendererGroup.parent ? rendererGroup.parent.id : null
            };
        }),
        "connections": _.map(this._rendererConnections, function (rendererConnection, i) {
            return {
                "cgConnectionIndex": i,
                "outputName": rendererConnection.outputRendererPoint.cgPoint.cgName,
                "outputRendererBlockId": rendererConnection.outputRendererPoint.rendererBlock.id,
                "inputName": rendererConnection.inputRendererPoint.cgPoint.cgName,
                "inputRendererBlockId": rendererConnection.inputRendererPoint.rendererBlock.id
            };
        })
    };
};