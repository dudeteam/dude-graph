cg.Loader = (function () {

    /**
     * Load a graph from JSON data.
     * @constructor
     */
    function Loader() {

    }

    Loader.prototype.load = function (node, data) {
        this["_load" + node.constructor.name](node, data);
    };

    /**
     * Load a node of type `Graph`.
     * @param graph {cg.Graph}
     * @param data {{}} JSON data
     * @private
     */
    Loader.prototype._loadGraph = function (graph, data) {
        for (var modelName in data.models) {
            if (data.models.hasOwnProperty(modelName)) {
                var model = data.models[modelName];
                graph.addModel(new cg.Model(modelName, model.inputs, model.outputs));
            }
        }
        for (var i = 0; i < data.actions.length; ++i) {
            var action = data.actions[i];
            graph.addAction(new cg.Action(graph, i, action.name, new cg.Vec2(action.position)));
        }
        for (var j = 0; j < data.connections.length; ++j) {
            var connection = data.connections[j];
            var first = graph.actions.get(connection.from[0]).outputs[connection.from[1]];
            var second = graph.actions.get(connection.to[0]).inputs[connection.to[1]];
            graph.addConnection(first, second);
        }
    };

    return Loader;

})();