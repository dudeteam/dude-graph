var BuildSaver = (function () {

    /**
     * Save a graph an audigame.
     * @constructor
     */
    var BuildSaver = pandora.class_("BuildSaver", pandora.EventEmitter, function () {
        pandora.EventEmitter.call(this);
    });

    BuildSaver.prototype.save = function (entity) {
        return pandora.polymorphicMethod(this, "save", entity);
    };

    BuildSaver.prototype.saveFromName = function (entity) {
        if (this["_save" + pandora.camelcase(entity._name)] !== undefined) {
            return this["_save" + pandora.camelcase(entity._name)](entity);
        } else {
            this.emit("error", new pandora.MissingOverloadError("save" + pandora.camelcase(entity._name, "-"), "BuildSaver"));
        }
    };

    BuildSaver.prototype.saveFromModel = function (entity, prefix) {
        if (this["_save" + prefix + pandora.camelcase(entity.model._type)] !== undefined) {
            return this["_save" + prefix + pandora.camelcase(entity.model._type)](entity);
        } else {
            this.emit("error", new pandora.MissingOverloadError("save" + prefix + pandora.camelcase(entity.model._type, "-"), "BuildSaver"));
        }
    };

    /**
     *
     * @param graph
     * @returns {{models: Object, children: Array, connections: Array}}
     * @private
     */
    BuildSaver.prototype._saveGraph = function (graph) {
        var variables = {};
        pandora.forEach(graph.models, function (model) {
            // only variables need to be saved
            if (model._type === "variable") {
                variables[model.name] = this.save(model);
            }
        }.bind(this));
        return {
            "variables": variables,
            "story": this._saveStart(graph)
        };
    };

    /**
     * @param model {cg.Variable}
     * @returns {Object} JSON data
     * @private
     */
    BuildSaver.prototype._saveVariable = function (model) {
        return {
            "type": model.valueType,
            "value": model.value
        };
    };

    /**
     * @param picker {cg.Block}
     * @returns {Object} JSON data
     * @private
     */
    BuildSaver.prototype._savePickerVariable = function (picker) {
        return {
            "type": picker.model.valueType,
            "name": picker.model.name
        };
    };

    /**
     * @param picker {cg.Block}
     * @returns {Object} JSON data
     * @private
     */
    BuildSaver.prototype._savePickerValue = function (picker) {
        return {
            "type": picker.model.valueType,
            "value": picker.value
        };
    };

    /**
     * @param graph
     * @returns {Object} JSON data
     * @private
     */
    BuildSaver.prototype._saveStart = function (graph) {
        var start = graph.findBlock(function (block) {
            return block._name === "start";
        });
        if (start === null) {
            this.emit("error", new cg.GraphError("A start block should be provided to create a story"));
        }
        return this.saveFromName(this._getOutputBlock(start, 0));
    };

    BuildSaver.prototype._saveStep = function (step) {
        var description = this._getInputBlock(step, 1);
        var sound = this._getInputBlock(step, 2);
        var duration = this._getInputBlock(step, 3);
        var firstChoice = this._getOutputBlock(step, 0);
        var secondChoice = this._getOutputBlock(step, 1);
        if (description === null || sound === null || duration === null || firstChoice === null || secondChoice === null) {
            return null;
        }
        return {
            "name": "step",
            "description": this.saveFromModel(description, "Picker"),
            "sound": this.saveFromModel(sound, "Picker"),
            "duration": this.saveFromModel(duration, "Picker"),
            "firstChoice": this.saveFromName(firstChoice),
            "secondChoice": this.saveFromName(secondChoice)
        };
    };

    BuildSaver.prototype._saveEnd = function (end) {
        var description = this._getInputBlock(end, 1);
        var sound = this._getInputBlock(end, 2);
        if (description === null || sound === null) {
            return null;
        }
        return {
            "name": "end",
            "description": this.saveFromModel(description, "Picker"),
            "sound": this.saveFromModel(sound, "Picker")
        };
    };

    BuildSaver.prototype._getInputBlock = function (block, index) {
        if (block.inputs[index].connections.length !== 1) {
            this.emit("error", new cg.GraphError("Missing input " + block.inputs[index].name + " in " + block.model.name));
            return null;
        }
        return block.inputs[index].connections[0].outputPoint.block;
    };

    BuildSaver.prototype._getOutputBlock = function (block, index) {
        if (block.outputs[index].connections.length !== 1) {
            this.emit("error", new cg.GraphError("Missing output " + block.outputs[index].name + " in " + block.model.name));
            return null;
        }
        return block.outputs[index].connections[0].inputPoint.block;
    };

    return BuildSaver;

})();