cg.Saver = (function () {

    /**
     * Save a graph into JSON
     * @constructor
     */
    function Saver() {

    }

    Saver.prototype.save = function (node) {
        return cg.polymorphicMethod(node.constructor, this, "save", node);
    };

    /**
     *
     * @param graph
     * @returns {{models: {}, actions: Array, connections: Array}}
     * @private
     */
    Saver.prototype._saveGraph = function (graph) {
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
     *
     * @param model
     * @returns {Object}
     * @private
     */
    Saver.prototype._saveModel = function (model) {
        return {
            name: model.name,
            inputs: model.inputs,
            outputs: model.outputs
        };
    };

    /**
     *
     * @param action
     * @returns {Object}
     * @private
     */
    Saver.prototype._saveAction = function (action) {
        return {
            "_type": action._type,
            "_id": action._id,
            "name": action.name,
            "position": action.position.toArray()
        };
    };

    Saver.prototype._saveGroup = function (group) {
        var data = {
            "_type": group._type,
            "_id": group._id,
            "name": group.name,
            "position": group.position.toArray(),
            "size": group.position.toArray(),
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
    Saver.prototype._saveConnection = function (connection) {
        return {
            "from": {"action": connection.firstPoint.action._id, "point": connection.firstPoint.name},
            "to": {"action": connection.secondPoint.action._id, "point": connection.secondPoint.name}
        }
    };

    return Saver;

})();