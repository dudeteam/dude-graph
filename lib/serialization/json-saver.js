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
            models[name] = this.save(model);
        }.bind(this));
        graph.children.forEach(function (child) {
            children.push(this.save(child));
        }.bind(this));
        for (var i = 0; i < graph.connections.length; ++i) {
            connections.push(this.save(graph.connections[i]));
        }
        return {
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
            "inputs": model.inputs,
            "outputs": model.outputs
        };
    };

    /**
     * @param model {cg.Getter}
     * @returns {Object} JSON data
     * @private
     */
    JSONSaver.prototype._saveGetter = function (model) {
        return {
            "type": "getter",
            "value-type": model.valueType
        };
    };

    /**
     * @param model {cg.Picker}
     * @returns {Object} JSON data
     * @private
     */
    JSONSaver.prototype._savePicker = function (model) {
        return {
            "type": "picker",
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
            "name": block.name,
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
            "from": {"block": connection.outputPoint.block._id, "point": connection.outputPoint.name},
            "to": {"block": connection.inputPoint.block._id, "point": connection.inputPoint.name}
        };
    };

    return JSONSaver;

})();