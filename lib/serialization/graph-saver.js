dudeGraph.GraphSaver = (function() {

    /**
     * Save a graph into JSON
     * @constructor
     */
    var GraphSaver = pandora.class_("GraphSaver", pandora.EventEmitter, function (config) {
        pandora.EventEmitter.call(this);
        this.config = config;
    });

    GraphSaver.prototype.save = function (graph) {
        var result = {
            "blocks": [],
            "connections": []
        };
        _.forEach(graph.cgBlocks, function (block) {
            result.blocks.push(this.saveBlock(block));
        }.bind(this));
        _.forEach(graph.cgConnections, function (connection) {
            result.connections.push(this._saveConnection(connection));
        }.bind(this));
        return result;
    };

    GraphSaver.prototype.saveBlock = function (block) {
        return {
            "cgType": block.blockType,
            "cgId": block.cgId,
            "cgName": block.cgName,
            "cgFolder": block.cgFolder,
            "cgInputs": this._savePoints(block.cgInputs),
            "cgOutputs": this._savePoints(block.cgOutputs)
        };
    };

    GraphSaver.prototype._savePoints = function (points) {
        var result = [];
        _.forEach(points, function (point) {
            result.push(this._savePoint(point));
        }.bind(this));
        return result;
    };

    GraphSaver.prototype._savePoint = function (point) {
        return {
            "cgType": point.pointType,
            "cgName": point.cgName,
            "cgValueType": point.cgValueType,
            "cgMaxConnections": point.cgMaxConnections
        };
    };

    GraphSaver.prototype._saveConnection = function (connection) {
        return {
            "cgOutputName": connection.cgOutputPoint.cgName,
            "cgOutputBlockId": connection.cgOutputPoint.cgBlock.cgId,
            "cgInputName": connection.cgInputPoint.cgName,
            "cgInputBlockId": connection.cgInputPoint.cgBlock.cgId
        };
    };

    return GraphSaver;

})();