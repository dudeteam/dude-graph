cg.GraphSaver = (function() {

    /**
     * Save a graph into JSON
     * @constructor
     */
    var GraphSaver = pandora.class_("GraphSaver", pandora.EventEmitter, function (config) {
        pandora.EventEmitter.call(this);
        this.config = config;
    });

    GraphSaver.prototype.save = function (value, tabs) {
        return pandora.polymorphicMethod(this, "save", value, tabs);
    };

    GraphSaver.prototype._saveGraph = function (graph) {
        var result = {
            "blocks": [],
            "connections": []
        };
        _.forEach(graph.cgBlocks, function (block) {
            result.blocks.push(this.save(block));
        }.bind(this));
        _.forEach(graph.cgConnections, function (connection) {
            result.connections.push(this._saveConnection(connection));
        }.bind(this));
        return result;
    };

    GraphSaver.prototype._saveDelegate = function (delegate) {
        var outputsData = [];
        _.forEach(delegate.cgOutputs, function (output) {
            outputsData.push(this.save(output));
        }.bind(this));
        return {
            "cgType": "Delegate",
            "cgId": delegate.cgId,
            "cgName": delegate.cgName,
            "cgFolder": delegate.cgFolder,
            "cgOutputs": outputsData
        };
    };

    GraphSaver.prototype._saveCondition = function (condition) {
        return {
            "cgType": "Condition",
            "cgId": condition.cgId,
            "cgName": condition.cgName
        };
    };

    GraphSaver.prototype._saveFunction = function (func) {
        return this._saveFunctionData(func, func.cgInputs, func.cgOutputs[0]);
    } ;

    GraphSaver.prototype._saveOperator = function (operator) {
        return this._saveFunction(operator);
    };

    GraphSaver.prototype._saveInstruction = function (instruction) {
        return this._saveFunctionData(instruction, instruction.cgInputs.slice(1), instruction.cgOutputs[1]);
    };

    GraphSaver.prototype._saveAssignation = function (assignation) {
        return this._saveInstruction(assignation);
    };

    GraphSaver.prototype._saveVariable = function (variable) {
        return {
            "cgType": pandora.typename(variable),
            "cgId": variable.cgId,
            "cgName": variable.cgName,
            "cgValueType": variable.cgValueType
        };
    };

    GraphSaver.prototype._saveValue = function (value) {
        return {
            "cgType": pandora.typename(value),
            "cgId": value.cgId,
            "cgValue": value.cgValue,
            "cgValueType": value.cgValueType
        };
    };

    GraphSaver.prototype._saveFunctionData = function (value, inputs, ret) {
        var inputsData = [];
        var returnData = null;
        _.forEach(inputs, function (input) {
            inputsData.push(this.save(input));
        }.bind(this));
        if (ret) {
            returnData = this.save(ret);
        }
        return {
            "cgType": pandora.typename(value),
            "cgId": value.cgId,
            "cgName": value.cgName,
            "cgTemplates": value.cgTemplates,
            "cgInputs": inputsData,
            "cgReturn": returnData
        };
    };

    GraphSaver.prototype._saveStream = function (stream) {
        return {
            "cgType": "Stream",
            "cgName": stream.cgName
        };
    };

    GraphSaver.prototype._savePoint = function (stream) {
        return {
            "cgType": "Point",
            "cgName": stream.cgName,
            "cgValueType": stream.cgValueType
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