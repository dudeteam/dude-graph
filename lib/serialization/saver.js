cg.Saver = (function () {

    /**
     * Save a graph into JSON
     * @constructor
     */
    function Saver() {

    }

    Saver.prototype.save = function (node) {
        return this["_save" + node.constructor.name](node);
    };

    /**
     *
     * @param graph
     * @returns {{models: {}, actions: Array, connections: Array}}
     * @private
     */
    Saver.prototype._saveGraph = function (graph) {
        var models = {};
        var actions = [];
        var connections = [];

        for (var modelName in graph.models) {
            if (graph.models.hasOwnProperty(modelName)) {
                models[modelName] = this.save(graph.models[modelName]);
            }
        }
        graph.actions.forEach(function (action) {
            actions.push(this.save(action));
        }.bind(this));
        graph.connections.forEach(function (connection) {
            connections.push(this.save(connection));
        }.bind(this));
        return {
            models: models,
            actions: actions,
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
            name: action.name,
            position: action.position.toArray()
        };
    };

    /**
     *
     * @param connection
     * @returns {Object}
     * @private
     */
    Saver.prototype._saveConnection = function (connection) {
        return {
            from: [connection.firstPoint.action.index, connection.firstPoint.name],
            to: [connection.secondPoint.action.index, connection.secondPoint.name]
        }
    };

    return Saver;

})();