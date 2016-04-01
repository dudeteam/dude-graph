/**
 * Dude-graph default saver
 * @class
 */
dudeGraph.GraphSaver = function () {
};

/**
 * Saves a graph as json
 * @param {dudeGraph.Graph} graph - The graph to save
 * @return {Object}
 */
dudeGraph.GraphSaver.prototype.save = function (graph) {
    var saver = this;
    return {
        "blocks": _.map(graph.graphBlocks, function (block) {
            return saver.saveBlock(block);
        }),
        "connections": _.map(graph.graphConnections, function (connection) {
            return saver.saveConnection(connection);
        }),
        "variables": _.map(graph.graphVariables, function (variable) {
            return saver.saveVariable(variable);
        })
    };
};

/**
 * Saves the block
 * @param {dudeGraph.Block} block
 * @return {Object}
 */
dudeGraph.GraphSaver.prototype.saveBlock = function (block) {
    var saver = this;
    return {
        "blockType": block.blockType,
        "blockId": block.blockId,
        "blockName": block.blockName,
        "blockOutputs": _.map(block.blockOutputs, function (point) {
            return saver.savePoint(point);
        }),
        "blockInputs": _.map(block.blockInputs, function (point) {
            return saver.savePoint(point);
        }),
        "blockTemplates": block.blockTemplates
    };
};

/**
 * Saves the point
 * @param {dudeGraph.Point} point
 * @return {Object}
 */
dudeGraph.GraphSaver.prototype.savePoint = function (point) {
    return {
        "pointType": point.pointType,
        "pointName": point.pointName,
        "pointValueType": point.pointValueType,
        "pointValue": point.pointValue,
        "pointTemplate": point.pointTemplate,
        "pointSingleConnection": point.pointSingleConnection
    };
};

/**
 * Saves the connection
 * @param {dudeGraph.Connection} connection
 * @return {Object}
 */
dudeGraph.GraphSaver.prototype.saveConnection = function (connection) {
    return {
        "connectionOutputPoint": connection.connectionOutputPoint.pointName,
        "connectionOutputBlock": connection.connectionOutputPoint.pointBlock.blockId,
        "connectionInputPoint": connection.connectionInputPoint.pointName,
        "connectionInputBlock": connection.connectionInputPoint.pointBlock.blockId
    };
};

/**
 * Saves the variable
 * @param {dudeGraph.Variable} variable
 * @return {Object}
 */
dudeGraph.GraphSaver.prototype.saveVariable = function (variable) {
    return {
        "variableName": variable.variableName,
        "variableValueType": variable.variableValueType,
        "variableValue": variable.variableValue,
        "variableBlock": variable.variableBlock.blockId
    };
};