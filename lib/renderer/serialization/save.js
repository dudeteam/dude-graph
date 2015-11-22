/**
 * Saves the renderNodes and renderConnections
 * @returns {Object}
 */
dudeGraph.Renderer.prototype.save = function () {
    return {
        "zoom": {
            "translate": this._zoom.translate || [0, 0],
            "scale": this._zoom.scale || 1
        },
        "blocks": _.map(this._renderBlocks, function (renderBlock) {
            return {
                "id": renderBlock.nodeId,
                "cgBlock": renderBlock.block.cgId,
                "description": renderBlock.nodeName,
                "position": renderBlock.nodePosition,
                "parent": renderBlock.renderGroupParent ? renderBlock.renderGroupParent.nodeId : null
            };
        }),
        "groups": _.map(this._renderGroups, function (renderGroup) {
            return {
                "id": renderGroup.nodeId,
                "description": renderGroup.nodeName,
                "position": renderGroup.nodePosition
            };
        }),
        "connections": _.map(this._renderConnections, function (renderConnection, i) {
            return {
                "cgConnectionIndex": i,
                "outputName": renderConnection.outputRenderPoint.point.cgName,
                "outputRendererBlockId": renderConnection.outputRenderPoint.renderBlock.nodeId,
                "inputName": renderConnection.inputRenderPoint.point.cgName,
                "inputRendererBlockId": renderConnection.inputRenderPoint.renderBlock.nodeId
            };
        })
    };
};