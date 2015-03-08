cg.JSONSaver = (function () {

    /**
     * Save a graph into JSON
     * @constructor
     */
    function JSONSaver() {

    }

    JSONSaver.prototype.save = function (node) {
        return cg.polymorphicMethod(node.constructor, this, "save", node);
    };

    /**
     *
     * @param graph
     * @returns {{models: Object, children: Array, connections: Array}}
     * @private
     */
    JSONSaver.prototype._saveGraph = function (graph) {
        var models = {};
        var children = [];
        var connections = [];

        for (var modelName in graph.models) {
            if (graph.models.hasOwnProperty(modelName)) {
                models[modelName] = this.save(graph.models[modelName]);
            }
        }
        graph.children.forEach(function (child) {
            children.push(this.save(child));
        }.bind(this));
        for (var i = 0; i < graph.connections.length; ++i) {
            connections.push(this.save(graph.connections[i]));
        }
        return {
            models: models,
            children: children,
            connections: connections
        };
    };

    /**
     * @param model {cg.Model}
     * @returns {Object} JSON data
     * @private
     */
    JSONSaver.prototype._saveModel = function (model) {
        return {
            name: model.name,
            inputs: model.inputs,
            outputs: model.outputs
        };
    };

    /**
     * @param block {cg.Block}
     * @returns {Object} JSON data
     * @private
     */
    JSONSaver.prototype._saveBlock = function (block) {
        return {
            "_type": cg.uncamelcase(block._type),
            "_id": block._id,
            "name": block.name,
            "position": block.position.toArray()
        };
    };

    /**
     * @param group {cg.Group}
     * @returns {Object} JSON data
     * @private
     */
    JSONSaver.prototype._saveGroup = function (group) {
        var data = {
            "_type": cg.uncamelcase(group._type),
            "_id": group._id,
            "name": group.name,
            "position": group.position.toArray(),
            "size": group.size.toArray(),
            "children": []
        };
        group.children.forEach(function (child) {
            data.children.push(this.save(child));
        }.bind(this));
        return data;
    };

    /**
     *
     * @param connection
     * @returns {Object}
     * @private
     */
    JSONSaver.prototype._saveConnection = function (connection) {
        return {
            "from": {"action": connection.outputPoint.action._id, "point": connection.outputPoint.name},
            "to": {"action": connection.inputPoint.action._id, "point": connection.inputPoint.name}
        };
    };

    return JSONSaver;

})();