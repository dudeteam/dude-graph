/**
 * Saves the renderer
 * @returns {Object}
 */
dudeGraph.Renderer.prototype._save = function () {
    var result = {
        "config": {
            "zoom": {
                "translate": this._config.zoom.translate || [0, 0],
                "scale": this._config.zoom.scale || 1
            }
        },
        "blocks": [],
        "groups": [],
        "connections": []
    };
    _.forEach(this._rendererBlocks, function (rendererBlock) {
        result.blocks.push({
            "id": rendererBlock.id,
            "cgBlock": rendererBlock.cgBlock.cgId,
            "position": rendererBlock.position,
            "parent": rendererBlock.parent ? rendererBlock.parent.id : null
        });
    });
    _.forEach(this._rendererGroups, function (rendererGroup) {
        result.groups.push({
            "id": rendererGroup.id,
            "description": rendererGroup.description,
            "position": rendererGroup.position,
            "parent": rendererGroup.parent ? rendererGroup.parent.id : null
        });
    });
    _.forEach(this._rendererConnections, function (rendererConnection, i) {
        result.connections.push({
            "cgConnectionIndex": i,
            "outputName": rendererConnection.outputRendererPoint.cgPoint.cgName,
            "outputRendererBlockId": rendererConnection.outputRendererPoint.rendererBlock.id,
            "inputName": rendererConnection.inputRendererPoint.cgPoint.cgName,
            "inputRendererBlockId": rendererConnection.inputRendererPoint.rendererBlock.id
        });
    });
    return result;
};