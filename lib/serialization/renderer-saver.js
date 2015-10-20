//
// Copyright (c) 2015 DudeTeam. All rights reserved.
//

/**
 * Save a graph into JSON
 * @constructor
 */
dudeGraph.RendererSaver = function (config) {
    pandora.EventEmitter.call(this);
    this.config = config;
};

/**
 * @extends {pandora.EventEmitter}
 */
dudeGraph.RendererSaver.prototype = _.create(pandora.EventEmitter.prototype, {
    "constructor": dudeGraph.RendererSaver
});

/**
 *
 * @param {dudeGraph.Renderer} renderer
 * @returns {{blocks: Array, groups: Array, connections: Array}}
 */
dudeGraph.RendererSaver.prototype.save = function (renderer) {
    var result = {
        "config": {
            "zoom": {
                "translate": (renderer._config && renderer._config.zoom && renderer._config.zoom.translate) || [0, 0],
                "scale": (renderer._config && renderer._config.zoom && renderer._config.zoom.scale) || 1
            }
        },
        "blocks": [],
        "groups": [],
        "connections": []
    };
    _.forEach(renderer._rendererBlocks, function (rendererBlock) {
        result.blocks.push({
            "id": rendererBlock.id,
            "cgBlock": rendererBlock.cgBlock.cgId,
            "position": rendererBlock.position,
            "parent": rendererBlock.parent ? rendererBlock.parent.id : null
        });
    });
    _.forEach(renderer._rendererGroups, function (rendererGroup) {
        result.groups.push({
            "id": rendererGroup.id,
            "description": rendererGroup.description,
            "position": rendererGroup.position,
            "parent": rendererGroup.parent ? rendererGroup.parent.id : null
        });
    });
    _.forEach(renderer._rendererConnections, function (rendererConnection, i) {
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
