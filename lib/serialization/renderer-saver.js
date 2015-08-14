cg.RendererSaver = (function() {

    /**
     * Save a graph into JSON
     * @constructor
     */
    var RendererSaver = pandora.class_("RendererSaver", pandora.EventEmitter, function (config) {
        pandora.EventEmitter.call(this);
        this.config = config;
    });

    RendererSaver.prototype.save = function (renderer) {
        var result = {
            "blocks": [],
            "groups": [],
            "connections": []
        };
        pandora.forEach(renderer._rendererBlocks, function (rendererBlock) {
            result.blocks.push({
                "id": rendererBlock.id,
                "cgBlock": rendererBlock.cgBlock.cgId,
                "position": rendererBlock.position,
                "parent": rendererBlock.parent ? rendererBlock.parent.id : null
            });
        });
        pandora.forEach(renderer._rendererGroups, function (rendererGroup) {
            result.groups.push({
                "id": rendererGroup.id,
                "description": rendererGroup.description,
                "parent": rendererGroup.parent ? rendererGroup.parent.id : null
            });
        });
        pandora.forEach(renderer._rendererConnections, function (rendererConnection) {
            result.connections.push({
                "outputName": rendererConnection.outputPoint.cgPoint.cgName,
                "outputBlockId": rendererConnection.outputPoint.rendererBlock.id,
                "inputName": rendererConnection.inputPoint.cgPoint.cgName,
                "inputBlockId": rendererConnection.inputPoint.rendererBlock.id
            });
        });
        return result;
    };

    return RendererSaver;

})();