/**
 * Returns the rendererPoint associated with the given name
 * @param rendererBlock {cg.RendererBlock}
 * @param rendererPointName {String}
 * @returns {cg.RendererPoint|null}
 * @private
 */
cg.Renderer.prototype._getRendererPointByName = function (rendererBlock, rendererPointName) {
    return pandora.findIf(rendererBlock.rendererPoints, function (rendererPoint) {
            return rendererPoint.cgPoint.cgName === rendererPointName;
        }
    );
};

/**
 * Creates the rendererPoints for a given rendererBlock
 * @param rendererBlock {cg.RendererBlock}
 * @private
 */
cg.Renderer.prototype._createsRendererPoints = function (rendererBlock) {
    rendererBlock.rendererPoints = [];
    pandora.forEach(rendererBlock.cgBlock.cgOutputs, function (cgOutput) {
        rendererBlock.rendererPoints.push({
            "type": "point",
            "rendererBlock": rendererBlock,
            "index": rendererBlock.cgBlock.cgOutputs.indexOf(cgOutput),
            "cgPoint": cgOutput,
            "isOutput": true,
            "connections": []
        });
    });
    pandora.forEach(rendererBlock.cgBlock.cgInputs, function (cgInput) {
        rendererBlock.rendererPoints.push({
            "type": "point",
            "rendererBlock": rendererBlock,
            "index": rendererBlock.cgBlock.cgInputs.indexOf(cgInput),
            "cgPoint": cgInput,
            "isOutput": false,
            "connections": []
        });
    });
};