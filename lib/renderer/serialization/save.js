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
            var renderBlockData = {
                "id": renderBlock.nodeId,
                "block": renderBlock.block.blockId,
                "description": renderBlock.nodeName,
                "position": renderBlock.nodePosition,
                "parent": renderBlock.renderGroupParent ? renderBlock.renderGroupParent.nodeId : null
            };
            var saveRenderPointCustomData = function (renderPoint) {
                if (renderPoint.pointHidden) {
                    var renderPointData = renderBlockData[renderPoint.point.pointOutput ? "outputs" : "inputs"] = {};
                    renderPointData[renderPoint.point.pointName] = {"hidden": renderPoint.pointHidden};
                }
            };
            _.forEach(renderBlock.renderPoints, saveRenderPointCustomData);
            return renderBlockData;
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
                "connectionIndex": i,
                "outputName": renderConnection.outputRenderPoint.point.pointName,
                "outputRendererBlockId": renderConnection.outputRenderPoint.renderBlock.nodeId,
                "inputName": renderConnection.inputRenderPoint.point.pointName,
                "inputRendererBlockId": renderConnection.inputRenderPoint.renderBlock.nodeId
            };
        })
    };
};