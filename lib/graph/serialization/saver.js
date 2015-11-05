//
// Copyright (c) 2015 DudeTeam. All rights reserved.
//

/**
 * Dude-graph default saver
 * @constructor
 */
dudeGraph.Saver = function () {};

/**
 * Saves a cgGraph as json
 * @param {dudeGraph.Graph} cgGraph - The graph to save
 */
dudeGraph.Saver.prototype.save = function (cgGraph) {
    var saver = this;
    return {
        "blocks": _.map(cgGraph.cgBlocks, function (cgBlock) {
            return saver.saveBlock(cgBlock);
        }),
        "connections": _.map(cgGraph.cgConnections, function (cgConnection) {
            return saver.saveConnection(cgConnection);
        })
    };
};


/**
 * Saves the block
 * @param {dudeGraph.Block} cgBlock
 * @return {Object}
 */
dudeGraph.Saver.prototype.saveBlock = function (cgBlock) {
    var saver = this;
    return {
        "cgType": cgBlock._blockType,
        "cgId": cgBlock._cgId,
        "cgName": cgBlock._cgName,
        "cgInputs": _.map(cgBlock._cgInputs, function (cgPoint) {
            return saver.savePoint(cgPoint);
        }),
        "cgOutputs": _.map(cgBlock._cgOutputs, function (cgPoint) {
            return saver.savePoint(cgPoint);
        })
    };
};

/**
 * Saves the point
 * @param {dudeGraph.Point} cgPoint
 * @return {Object}
 */
dudeGraph.Saver.prototype.savePoint = function (cgPoint) {
    var pointData = {
        "cgType": cgPoint.pointType,
        "cgName": cgPoint._cgName,
        "cgValueType": cgPoint._cgValueType,
        "singleConnection": cgPoint._singleConnection
    };
    if (!cgPoint._isOutput) {
        pointData.cgValue = cgPoint._cgValue;
    }
    return pointData;
};

/**
 * Saves the connection
 * @param {dudeGraph.Connection} cgConnection
 * @return {Object}
 */
dudeGraph.Saver.prototype.saveConnection = function (cgConnection) {
    return {
        "cgOutputName": cgConnection._cgOutputPoint._cgName,
        "cgOutputBlockId": cgConnection._cgOutputPoint._cgBlock._cgId,
        "cgInputName": cgConnection._cgInputPoint._cgName,
        "cgInputBlockId": cgConnection._cgInputPoint._cgBlock._cgId
    };
};