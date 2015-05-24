cg.JSONSaver = (function () {

    /**
     * Save a graph into JSON
     * @constructor
     */
    var JSONSaver = pandora.class_("JSONSaver", pandora.EventEmitter, function () {
        pandora.EventEmitter.call(this);
    });

    JSONSaver.prototype.save = function (entity) {
        return pandora.polymorphicMethod(this, "save", entity);
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
        pandora.forEach(graph.models, function (model, name) {
            if (name.indexOf("set ") !== -1) { // do not save setters, they are automatically generated.
                models[model.name] = this.save(model);
            }
        }.bind(this));
        graph.children.forEach(function (child) {
            children.push(this.save(child));
        }.bind(this));
        for (var i = 0; i < graph.connections.length; ++i) {
            connections.push(this.save(graph.connections[i]));
        }
        return {
            "types": graph.types,
            "models": models,
            "children": children,
            "connections": connections
        };
    };

    /**
     * @param model {cg.Action}
     * @returns {Object} JSON data
     * @private
     */
    JSONSaver.prototype._saveAction = function (model) {
        return {
            "type": "action",
            "description": model.description,
            "inputs": model.inputs,
            "outputs": model.outputs
        };
    };

    /**
     * @param model {cg.Variable}
     * @returns {Object} JSON data
     * @private
     */
    JSONSaver.prototype._saveVariable = function (model) {
        return {
            "type": "variable",
            "value-type": model.valueType,
            "value": model.value
        };
    };

    /**
     * @param model {cg.Value}
     * @returns {Object} JSON data
     * @private
     */
    JSONSaver.prototype._saveValue = function (model) {
        return {
            "type": "value",
            "value-type": model.valueType,
            "default": model.value
        };
    };

    /**
     * @param block {cg.Block}
     * @returns {Object} JSON data
     * @private
     */
    JSONSaver.prototype._saveBlock = function (block) {
        return {
            "_type": pandora.uncamelcase(block._type, "-"),
            "_id": block._id,
            "_name": block.__name,
            "position": block.position.toArray(),
            "value": block.value
        };
    };

    /**
     * @param group {cg.Group}
     * @returns {Object} JSON data
     * @private
     */
    JSONSaver.prototype._saveGroup = function (group) {
        var data = {
            "_type": pandora.uncamelcase(group._type, "-"),
            "_id": group._id,
            "_name": group._name,
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
            "from": {"block": connection.outputPoint.block._id, "point": connection.outputPoint.name},
            "to": {"block": connection.inputPoint.block._id, "point": connection.inputPoint.name}
        };
    };

    return JSONSaver;

})();