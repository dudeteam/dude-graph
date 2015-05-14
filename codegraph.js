/**
 * @namespace pandora
 * @type {Object}
 */
var cg = (function () {
    var namespace = {};
    if (typeof exports !== "undefined") {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = namespace;
        }
        exports.cg = namespace;
    } else {
        window.cg = namespace;
    }
    return namespace;
})();
cg.Container = (function () {

    /**
     * Entity container.
     * @constructor
     */
    var Container = pandora.class_("Container", function () {

        /**
         * Entities contained in this container.
         * @type {Array<cg.Entity>}
         * @private
         */
        this._entities = [];
        Object.defineProperty(this, "entities", {
            get: function () { return this._entities; }.bind(this)
        });
    });

    /**
     * Add the given entity.
     * @param entity {cg.Entity}
     */
    Container.prototype.add = function (entity) {
        this._entities.push(entity);
    };

    /**
     * Remove the given entity.
     * @param entity {cg.Entity}
     */
    Container.prototype.remove = function (entity) {
        var entityFound = this._entities.indexOf(entity);
        if (entityFound === -1) {
            throw new cg.GraphError('Entity not found in this container', this, entity);
        }
        this._entities.splice(entityFound, 1);
    };

    /**
     * Return the entity at the given index.
     * @param i {Number}
     * @returns {cg.Entity}
     */
    Container.prototype.get = function (i) {
        return this._entities[i];
    };

    /**
     * Call the callback for each entity.
     * @param callback {Function}
     */
    Container.prototype.forEach = function (callback) {
        for (var i = 0; i < this._entities.length; ++i) {
            if (callback(this._entities[i])) {
                return true;
            }
        }
        return false;
    };

    return Container;

})();

cg.GraphError = (function () {

    /**
     * Handle graph related errors.
     * @constructor
     */
    return pandora.class_("GraphError", function () {
        return pandora.Exception.apply(this, arguments);
    });

})();
cg.Model = (function () {

    /**
     * Represent an action model, aka how an Action entity will be created
     * @param name {String} the action's name
     * @param inputs {Array<Object<String, String>>} the parameters
     * @param outputs {Array<Object<String, String>>} the returned values
     * @param type {String?} to specify a type of action (getters for instance)
     * @constructor
     */
    return pandora.class_("Model", function (name, inputs, outputs, type) {
        /**
         * Model type.
         * @type {Number}
         * @private
         */
        this._type = type;
        Object.defineProperty(this, "type", {
            get: function () { return this._type; }.bind(this)
        });

        /**
         * Name of the model.
         * @type {String}
         * @private
         */
        this._name = name;
        Object.defineProperty(this, "name", {
            get: function () { return this._name; }.bind(this)
        });

        /**
         *
         * @type {Array<cg.Point>}
         * @private
         */
        this._inputs = inputs || [];
        Object.defineProperty(this, "inputs", {
            get: function () { return this._inputs; }.bind(this)
        });

        /**
         *
         * @type {Array<cg.Point>}
         * @private
         */
        this._outputs = outputs || [];
        Object.defineProperty(this, "outputs", {
            get: function () { return this._outputs; }.bind(this)
        });
    });

})();


cg.Action = (function () {

    /**
     * It represents the most generic type of block, it has a list of input and outputs and a name.
     * @param data {Object} some JSON data to represent the model
     * @extends cg.Model
     * @constructor
     */
    return pandora.class_("Action", cg.Model, function (data) {
        cg.Model.call(this, data.name, data.inputs, data.outputs, "action");
    });

})();
cg.Variable = (function () {

    /**
     * Get a global variable of the blueprint.
     * @param data {Object} some JSON data to represent the model
     * @extends cg.Model
     * @constructor
     */
    return pandora.class_("Variable", cg.Model, function (data) {
        cg.Model.call(this, data.name, [], [{"name": data.name, "type": data["value-type"]}], "variable");

        /**
         * Shortcut to get the valueType of the picker.
         * @type {String}
         */
        Object.defineProperty(this, "valueType", {
            get: function () { return this._outputs[0].type; }
        });

    });

})();
cg.Value = (function () {

    /**
     * Like getter, this model returns only one value. However, its not link to a variable but just contains the
     * actual value.
     * @param data {Object} some JSON data to represent the model
     * @extends cg.Model
     * @constructor
     */
    return pandora.class_("Value", cg.Model, function (data) {
        cg.Model.call(this, "value-" + data["value-type"], [], [{"value": data.value, "type": data["value-type"]}], "value");

        /**
         * The current value set into this picker.
         * @type {*}
         * @private
         */
        this._value = data["default"];
        Object.defineProperty(this, "value", {
            get: function () { return this._value; }.bind(this)
        });

        /**
         * Shortcut to get the valueType of the picker.
         * @type {String}
         */
        Object.defineProperty(this, "valueType", {
            get: function () { return this._outputs[0].type; }
        });

    });

})();
cg.Point = (function () {

    /**
     * Represent a point into the graph to connect an action to another.
     * @param block {cg.Block} The block on which the point is attached.
     * @param index {Number} The vertical index of the point within the block.
     * @param type {Number} The type of this connection (e.g. Number, Color, etc...).
     * @param name {Number} The name of this connection.
     * @param isInput {Boolean} Whether the point is an input or an output.
     * @constructor
     */
    var Point = pandora.class_("Point", pandora.EventEmitter, function (block, index, type, name, isInput) {
        pandora.EventEmitter.call(this);

        /**
         * The block this point belongs to.
         * @type {cg.Block}
         * @private
         */
        this._block = block;
        Object.defineProperty(this, "block", {
            get: function () { return this._block; }.bind(this)
        });

        /**
         * Point index within the action.
         * @type {Number}
         * @private
         */
        this._index = index;
        Object.defineProperty(this, "index", {
            get: function () { return this._index; }.bind(this)
        });

        /**
         * Point type.
         * @type {Number}
         * @private
         */
        this._type = type;
        Object.defineProperty(this, "type", {
            get: function () { return this._type; }.bind(this)
        });

        /**
         * Name of the point.
         * @type {String}
         * @private
         */
        this._name = name;
        Object.defineProperty(this, "name", {
            get: function () { return this._name; }.bind(this)
        });

        /**
         * Is the point an input.
         * @type {Boolean}
         * @private
         */
        this._isInput = isInput;
        Object.defineProperty(this, "isInput", {
            get: function () { return this._isInput; }.bind(this)
        });

        /**
         * Point connections.
         * @type {Array}
         * @private
         */
        this._connections = [];
        Object.defineProperty(this, "connections", {
            get: function () { return this._connections; }.bind(this)
        });

        /**
         * Point data
         * @type {Object}
         * @private
         */
        this._data = {};
        Object.defineProperty(this, "data", {
            get: function () { return this._data; }.bind(this),
            set: function (data) { this._data = data; }.bind(this)
        });
    });

    /**
     * Add a connection for this point, this is called by graph.addConnection(connection) and dispatched here if the connection has this point.
     * Never call this directly
     * @param {cg.Connection} connection
     * @return {cg.Connection|null} the connection if the add was successful, null otherwise
     */
    Point.prototype.addConnection = function (connection) {
        if (this._connections.indexOf(connection) !== -1) {
            this.emit("error", new cg.GraphError("This connection is already in this point"));
            return null;
        }
        this._connections.push(connection);
        this.emit("connection.add", connection);
        return connection;
    };

    /**
     * Remove a connection for this point, this is called by graph.removeConnection(connection) and dispatched here if the connection has this point.
     * Never call this directly
     * @param connection
     */
    Point.prototype.removeConnection = function (connection) {
        var foundConnection = this._connections.indexOf(connection);
        if (foundConnection === -1) {
            this.emit("error", new cg.GraphError("This connection was not in this point"));
            return null;
        }
        this._connections.splice(foundConnection, 1);
        this.emit("connection.remove", connection);
        return connection;
    };

    /**
     * Remove all connections attached to this point.
     */
    Point.prototype.disconnect = function () {
        while (this._connections.length) {
            if (!this.block.graph.removeConnection(this._connections[0])) {
                return;
            }
        }
    };

    return Point;

})();
cg.Connection = (function () {

    /**
     * Represent a connection between 2 points of the graph.
     * @param firstPoint {cg.Point}
     * @param secondPoint {cg.Point}
     * @constructor
     */
    var Connection = pandora.class_("Connection", pandora.EventEmitter, function (firstPoint, secondPoint) {
        pandora.EventEmitter.call(this);

        /**
         * Represent the input point of the connection.
         * @type {cg.Point}
         * @private
         */
        this._inputPoint = firstPoint.isInput ? firstPoint : secondPoint;
        Object.defineProperty(this, "inputPoint", {
            get: function () { return this._inputPoint; }.bind(this)
        });

        /**
         * Represent the output point of the connection.
         * @type {cg.Point}
         * @private
         */
        this._outputPoint = firstPoint.isInput ? secondPoint : firstPoint;
        Object.defineProperty(this, "outputPoint", {
            get: function () { return this._outputPoint; }.bind(this)
        });

        /**
         * Contain some user defined data.
         * @type {Object}
         * @private
         */
        this._data = {};
        Object.defineProperty(this, "data", {
            get: function () { return this._data; }.bind(this),
            set: function (data) { this._data = data; }.bind(this)
        });

    });

    /**
     * Check whether the 2 connections are the same.
     * @param other {cg.Connection}
     * @returns {boolean}
     */
    Connection.prototype.equal = function (other) {
        return this._inputPoint === other._inputPoint && this._outputPoint === other._outputPoint;
    };

    /**
     * Return the point of the connection which is not the one given in parameter.
     * @param point {cg.Point}
     * @returns {cg.Point}
     */
    Connection.prototype.otherPoint = function (point) {
        return point === this._inputPoint ? this._outputPoint : this._inputPoint;
    };

    /**
     * Replace the point of the connection which is not the one given in parameter.
     * @param source {cg.Point}
     * @param target {cg.Point}
     */
    Connection.prototype.replacePoint = function (source, target) {
        if (target.isInput !== source.isInput) {
            renderer._graph.emit("error", new cg.GraphError("Cannot link " + (source.isInput ? "inputs" : "outputs") + " together"));
            return false;
        }
        if (this._inputPoint === source) {
            this._inputPoint = target;
        } else {
            this._outputPoint = target;
        }
        return true;
    };

    return Connection;

})();
cg.Entity = (function () {

    /**
     * Represent an entity in the graph.
     * @param _id {Number|String} the unique id within the graph for this kind of entity.
     * @param _type {String}
     * @param name {String}
     * @param position {pandora.Vec2}
     * @param data {Object}
     * @constructor
     */
    var Entity = pandora.class_("Entity", pandora.EventEmitter, function (_id, _type, _name, position, data) {
        pandora.EventEmitter.call(this);

        /**
         * Unique identifier for this kinf of entity.
         * @type {Number|String}
         * @private
         */
        this.__id = _id;
        Object.defineProperty(this, "_id", {
            get: function () { return this.__id; }.bind(this)
        });

        /**
         * Type of the entity.
         * @type {String}
         * @private
         */
        this.__type = _type;
        Object.defineProperty(this, "_type", {
            get: function () { return this.__type; }.bind(this)
        });

        /**
         * Name of the entity.
         * @type {String}
         * @private
         */
        this.__name = _name;
        Object.defineProperty(this, "_name", {
            get: function () { return this.__name; }.bind(this)
        });

        /**
         * Entity parent.
         * @type {cg.Entity}
         * @private
         */
        this._parent = null;
        Object.defineProperty(this, "parent", {
            get: function () { return this._parent; }.bind(this),
            set: function (parent) { this._parent = parent; }.bind(this)
        });

        /**
         * Entity position.
         * @type {pandora.Vec2}
         * @private
         */
        this._position = position || new pandora.Vec2();
        Object.defineProperty(this, "position", {
            get: function () { return this._position; }.bind(this),
            set: function (position) { this._position = position; }.bind(this)
        });

        /**
         * Entity absolute position.
         * @returns {pandora.Vec2}
         */
        Object.defineProperty(this, "absolutePosition", {
            get: function () {
                var position = new pandora.Vec2(0, 0);
                var entity = this;
                while (entity) {
                    position.add(entity.position);
                    entity = entity.parent;
                }
                return position;
            }.bind(this)
        });

        /**
         * Entity data
         * @type {Object}
         * @private
         */
        this._data = data || {};
        Object.defineProperty(this, "data", {
            get: function () { return this._data; }.bind(this),
            set: function (data) { this._data = data; }.bind(this)
        });

        /**
         * Get the graph instance for this entity.
         */
        Object.defineProperty(this, "graph", {
            get: function() {
                var entity = this;
                while (entity) {
                    if (!entity.parent) {
                        return entity;
                    }
                    entity = entity.parent;
                }
                return null;
            }.bind(this)
        });
    });

    /**
     * Change the parent of the entity.
     * @protected
     */
    Entity.prototype._changeParent = function(newParent) {
        if (!this.parent) {
            this.graph.emit("error", new cg.GraphError("Cannot change parent, parent is null", this));
            return;
        }
        if (this.parent === newParent) {
            return;
        }
        if (!newParent) {
            this.graph.emit("error", new cg.GraphError("Cannot change parent to new parent, the new parent is null"));
            return;
        }
        this.graph.emit("entity.change-parent", this, this.parent, newParent);
        this.emit("change-parent", this, this.parent, newParent);
        this.position.add(this.parent.absolutePosition);
        this.position.subtract(newParent.absolutePosition);
        this.parent._removeChild(this);
        this.parent = newParent;
    };

    /**
     * Remove the entity from the graph.
     * @protected
     */
    Entity.prototype._remove = function() {
        this.parent._removeChild(this);
        this.graph.emit("entity.remove", this);
        this.emit("remove", this);
    };

    return Entity;

})();


cg.Group = (function () {

    /**
     * Represent a group instance into the graph, a group is a container for grouping sub-entities.
     * @param _id {Number|String} the unique id within the graph for this kind of entity.
     * @param name {String} the description of the group content
     * @param position {pandora.Vec2} the position on the screen.
     * @param size {pandora.Vec2} the size on the screen.
     * @extends cg.Entity
     * @constructor
     */
    var Group = pandora.class_("Group", cg.Entity, function (_id, _name, position, size) {
        cg.Entity.call(this, _id, this.constructor.typename, _name, position);

        /**
         * Group can change its description.
         */
        Object.defineProperty(this, "description", {
            get: function () { return this.__name; }.bind(this),
            set: function (description) { this.__name = description; }.bind(this)
        });

        /**
         * Group size.
         * @type {pandora.Vec2}
         * @private
         */
        this._size = size || new pandora.Vec2();
        Object.defineProperty(this, "size", {
            get: function () { return this._size; }.bind(this),
            set: function (size) { this._size = size; }.bind(this)
        });

        /**
         * Group children.
         * @type {cg.Container}
         * @private
         */
        this._children = new cg.Container();
        Object.defineProperty(this, "children", {
            get: function () { return this._children; }.bind(this)
        });

        /**
         * Helper method to get the bounding box of this group.
         */
        Object.defineProperty(this, "box", {
            get: function () { return new pandora.Box2(this.absolutePosition, this._size); }.bind(this)
        });
    });

    /**
     * Call the callback for each child recursively.
     * @param callback {Function}
     */
    Group.prototype.forEachChild = function (callback) {
        (function next(group) {
            group.children.forEach(function (entity) {
                if (callback(entity)) {
                    return;
                }
                if (entity instanceof cg.Group) {
                    next(entity);
                }
            });
        })(this);
    };

    /**
     * Add the given entity.
     * @param entity {cg.Entity}
     * @protected
     */
    Group.prototype._addChild = function (entity) {
        if (entity.parent === this) {
            this.graph.emit("error", new Error("Cannot add entity as child if the entity is already a child", this, entity));
            return ;
        }
        if (entity.parent) {
            entity._changeParent(this);
        }
        entity.parent = this;
        this._children.add(entity);
    };

    /**
     * Remove the given entity from the group.
     * @param entity {cg.Entity}
     * @protected
     */
    Group.prototype._removeChild = function (entity) {
        this._children.remove(entity);
    };

    /**
     * Remove the group from the graph.
     * @protected
     * @override
     */
    Group.prototype._remove = function() {
        var graph = this.graph;
        (function next(children) {
            while (children[0]) {
                graph.removeEntity(children[0]);
            }
        })(this._children._entities);
        cg.Entity.prototype._remove.call(this);
    };

    return Group;

})();


cg.Block = (function () {

    /**
     * Represent an action instance into the graph.
     * @param _id {Number|String} the unique id within the graph for this kind of entity.
     * @param model {cg.Model} the action model.
     * @param position {pandora.Vec2} the position on the screen.
     * @param value {*}
     * @extends cg.Entity
     * @constructor
     */
    var Block = pandora.class_("Block", cg.Entity, function (_id, model, position, value) {
        cg.Entity.call(this, _id, this.constructor.typename, model.name, position);

        /**
         * The model applied on the block.
         * @type {cg.Model}
         * @private
         */
        this._model = model;
        Object.defineProperty(this, "model", {
            get: function () { return this._model; }.bind(this)
        });

        /**
         * The generated point from the inputs of the model.
         * @type {Array<cg.Point>}
         * @private
         */
        this._inputs = [];
        Object.defineProperty(this, "inputs", {
            get: function () { return this._inputs; }.bind(this)
        });

        /**
         * The generated point from the outputs of the model.
         * @type {Array<cg.Point>}
         * @private
         */
        this._outputs = [];
        Object.defineProperty(this, "outputs", {
            get: function () { return this._outputs; }.bind(this)
        });

        /**
         * The maximal number of points vertically.
         * @type {number}
         * @private
         */
        this._height = Math.max(model.inputs.length, model.outputs.length);
        Object.defineProperty(this, "height", {
            get: function () { return this._height; }.bind(this)
        });

        /**
         * An optional value for this action.
         * @type {*}
         * @private
         */
        this._value = value || this.model.value;
        Object.defineProperty(this, "value", {
            get: function () { return this._value; }.bind(this),
            set: function (value) {
                this._value = value;
                this.emit("change", this.value);
            }.bind(this)
        });

        Block.prototype.initialize.call(this);
    });

    /**
     * Initialize all action points.
     */
    Block.prototype.initialize = function() {
        pandora.forEach(this._model.inputs, function (input, index) {
            this._inputs.push(new cg.Point(this, index, input.type, input.name, true));
        }.bind(this));
        pandora.forEach(this._model.outputs, function (output, index) {
            this._outputs.push(new cg.Point(this, index, output.type, output.name, false));
        }.bind(this));
    };

    /**
     * Return a point within the action from its index.
     * @param name {String}
     * @param type {String} "inputs" or "outputs"
     * @returns {cg.Point}
     */
    Block.prototype.getPoint = function (name, type) {
        var foundPoint = null;
        pandora.forEach(this[type], function (point) {
            if (point.name === name) {
                foundPoint = point;
                return true;
            }
        });
        return foundPoint;
    };

    /**
     * Remove the block from the graph.
     * @protected
     * @override
     */
    Block.prototype._remove = function() {
        pandora.forEach(this._inputs, function (input) {
            input.disconnect();
        });
        pandora.forEach(this._outputs, function (output) {
            output.disconnect();
        });
        cg.Entity.prototype._remove.call(this);
    };

    return Block;

})();


cg.Graph = (function () {

    /**
     * Represent a graph of connected actions.
     * @extends cg.Group
     * @constructor
     */
    var Graph = pandora.class_("Graph", cg.Group, function () {
        cg.Group.call(this, null, this.constructor.typename, new pandora.Vec2(0, 0), new pandora.Vec2(0, 0));

        /**
         * Contains all the types allowed in this codegraph.
         * @type {Array<String>}
         */
        this.types = [];

        /**
         * Contains the model of actions that can be created.
         * @type {Object}
         * @private
         */
        this._models = {};
        Object.defineProperty(this, "models", {
            get: function () { return this._models; }.bind(this)
        });

        /**
         * Contains all connections of the graph.
         * @type {Array}
         * @private
         */
        this._connections = [];
        Object.defineProperty(this, "connections", {
            get: function () { return this._connections; }.bind(this)
        });

        /**
         *
         * @type {Object}
         * @private
         */
        this._registeredGroupIds = {};

        /**
         * Used to generate new ids for groups automatically.
         * @type {number}
         * @private
         */
        this._groupIdOffset = 0;

        /**
         *
         * @type {Object}
         * @private
         */
        this._registeredBlockIds = {};

        /**
         * Used to generate new ids for blocks automatically.
         * @type {number}
         * @private
         */
        this._blockIdOffset = 0;

    });

    /**
     * Return the next ID available for groups in this graph.
     * @returns {Number}
     */
    Graph.prototype.getNextGroupId = function () {
        while (this._registeredGroupIds[this._groupIdOffset] !== undefined) {
            this._groupIdOffset++;
        }
        return this._groupIdOffset;
    };

    /**
     * Return the next ID available for blocks in this graph.
     * @returns {Number}
     */
    Graph.prototype.getNextBlockId = function () {
        while (this._registeredBlockIds[this._blockIdOffset] !== undefined) {
            this._blockIdOffset++;
        }
        return this._blockIdOffset;
    };

    /**
     * Add a model of action.
     * @param model {cg.Model|cg.Variable|cg.Value|cg.Action}
     */
    Graph.prototype.addModel = function (model) {
        this._models[model.name] = model;
    };

    /**
     * Get a model from its name.
     * @param name {String}
     */
    Graph.prototype.getModel = function (name) {
        return this._models[name];
    };

    /**
     * Find models within the graph.
     * @param options {Object} some search options.
     * @option options.modelType {String?} the type of model to search
     * @option options.type {String?} search only model that has the given type in input or output
     * @option options.isInput {Boolean?} whether the type to search is an input or an output
     * @option options.limit {Number?} the maximal number of result
     * @option options.pattern {String} a pattern to match the model name
     */
    Graph.prototype.findModels = function (options) {
        var models = [];
        options = options || {};
        options.limit = options.limit || 5;
        options.pattern = options.pattern ? new RegExp("^" + options.pattern, "g") : null;
        var _hasPoint = function (model, options) {
            if (options.isInput === undefined || options.type === undefined) {
                return true;
            }
            var _checkType = function (point) { return point.type === options.type; };
            return options.isInput ? model.inputs.filter(_checkType).length : model.outputs.filter(_checkType).length;
        };
        pandora.forEach(this.models, function (model, name) {
            if ((options.modelType === undefined || model.type === options.modelType) &&
                (options.pattern === null || name.match(options.pattern)) &&
                _hasPoint(model, options)) {
                models.push({name: name, data: model});
            }
            if (models.length == options.limit) {
                return true;
            }
        });
        return models;
    };

    /**
     * Add the entity to the parent in this graph.
     * @param entity {cg.Entity}
     * @param parent {cg.Group}
     * @return {cg.Entity|null} return the entity if successfully added, or null otherwise
     */
    Graph.prototype.addEntity = function (entity, parent) {
        if (parent.graph !== this) {
            this.emit("error", new cg.GraphError("The parent does not belong to this graph.", parent));
        } else if (entity.parent) {
            this.emit("error", new cg.GraphError("This entity already has a parent, maybe you would like to call moveEntity instead", parent));
        } else {
            if (entity instanceof cg.Graph) {
                this.emit("error", new cg.GraphError("Cannot add a parent to a graph", entity));
                return null;
            }
            if (entity instanceof cg.Group) {
                if (this._registeredGroupIds[entity._id]) {
                    this.emit("error", new cg.GraphError("This id is already in use for group {0}", entity._id));
                    return null;
                }
                this._registeredGroupIds[entity._id] = entity;
            } else if (entity instanceof cg.Block) {
                if (this._registeredBlockIds[entity._id]) {
                    this.emit("error", new cg.GraphError("This id is already in use for a block {0}", entity._id));
                    return null;
                }
                this._registeredBlockIds[entity._id] = entity;
            }
            parent._addChild(entity);
            this.emit("entity.add", entity);
            return entity;
        }
        return null;
    };

    /**
     * Change the entity position in the graph by adding it to the given parent.
     * @param entity {cg.Entity}
     * @param newParent {cg.Group}
     * @return {cg.Entity|null} return the entity if successfully added, or null otherwise
     */
    Graph.prototype.moveEntity = function (entity, newParent) {
        if (newParent.graph !== this) {
            this.emit("error", new cg.GraphError("The new parent does not belong to this graph.", newParent));
            return null;
        } else if (!entity.parent || entity.graph !== this) {
            this.emit("error", new cg.GraphError("This entity does not belong to this graph.", newParent));
        } else {
            newParent._addChild(entity);
            return entity;
        }
        return null;
    };

    /**
     * @param entity {cg.Entity|cg.Group|cg.Block}
     * @param entity
     */
    Graph.prototype.removeEntity = function (entity) {
        if (!entity.parent || entity.graph !== this) {
            this.emit("error", new cg.GraphError("This entity does not belong to this graph.", newParent));
        } else {
            if (entity instanceof cg.Group) {
                delete this._registeredGroupIds[entity._id];
            } else {
                delete this._registeredBlockIds[entity._id];
            }
            entity._remove();
        }
    };

    /**
     *
     * @return {Array<cg.Group>}
     */
    Graph.prototype.groups = function () {
        var groups = [];
        for (var group in this._registeredGroupIds) {
            if (this._registeredGroupIds.hasOwnProperty(group)) {
                groups.push(this._registeredGroupIds[group]);
            }
        }
        return groups;
    };

    /**
     *
     * @return {Array<cg.Block>}
     */
    Graph.prototype.blocks = function () {
        var blocks = [];
        for (var block in this._registeredBlockIds) {
            if (this._registeredBlockIds.hasOwnProperty(block)) {
                blocks.push(this._registeredBlockIds[block]);
            }
        }
        return blocks;
    };

    /**
     * Return the group by id.
     * @param id
     * @return {cg.Group|null}
     */
    Graph.prototype.groupById = function (id) {
        return this._registeredGroupIds[id] || null;
    };

    /**
     * Return the block by id.
     * @param id
     * @return {cg.Block|null}
     */
    Graph.prototype.blockById = function (id) {
        return this._registeredBlockIds[id] || null;
    };

    /**
     * Add the connection object into the graph.
     * @param connection {cg.Connection}
     * @return {cg.Connection|null} the connection if the add was successful, null otherwise
     */
    Graph.prototype.addConnection = function (connection) {
        var error = false;
        pandora.forEach(this._connections, function (currentConnection) {
            if (currentConnection.equal(connection)) {
                error = true;
                return true;
            }
        });
        if (error) {
            this.emit("error", new cg.GraphError("This connection is already in the graph"));
            return null;
        }
        var graphForInput = connection.inputPoint.block.graph;
        var graphForOutput = connection.outputPoint.block.graph;
        if (graphForInput !== this || graphForOutput !== this) {
            this.emit("error", new cg.GraphError("This connection does not belong to this graph"));
            return null;
        }
        if (connection.inputPoint.type !== connection.outputPoint.type) {
            this.emit("error", new cg.GraphError("Cannot create connection between types {0} and {1}",
                connection.inputPoint.type, connection.outputPoint.type));
            return null;
        }
        if (connection.inputPoint.block._id === connection.outputPoint.block._id) {
            this.emit("error", new cg.GraphError("Cannot link a block to itself"));
            return null;
        }
        if (connection.inputPoint.addConnection(connection) && connection.outputPoint.addConnection(connection)) {
            this._connections.push(connection);
            this.emit("connection.add", connection);
            return connection;
        }
        return null;
    };

    /**
     * Remove the connection object from the graph.
     * @param connection {cg.Connection}
     */
    Graph.prototype.removeConnection = function (connection) {
        var foundConnection = this._connections.indexOf(connection);
        if (foundConnection === -1) {
            this.emit("error", new cg.GraphError("This connection was not in this graph"));
            return null;
        }
        if (connection.inputPoint.removeConnection(connection) && connection.outputPoint.removeConnection(connection)) {
            this._connections.splice(foundConnection, 1);
            this.emit("connection.remove", connection);
            connection.emit("remove");
            return connection;
        }
        return null;
    };

    /**
     * You can't remove the graph entity.
     * @protected
     * @override
     */
    Graph.prototype._remove = function () {
        this.emit("error", new cg.GraphError("Cannot remove graph entity.", parent));
    };

    return Graph;

})();
cg.Renderer = (function () {

    /**
     * Contain all the default value of the renderer config, these values will be used when they aren't specified
     * into the config given in parameter.
     * @type {Object}
     */
    var DEFAULT_CONFIG = {
        "zoom": {
            "maxZoom": 5,
            "minZoom": 0.25
        },
        "group": {
            "defaultWidth": 300,
            "defaultHeight": 200,
            "heading": 20,
            "padding": 20,
            "borderRadius": 0
        },
        "block": {
            "padding": 20,
            "heading": 40,
            "centerSpacing": 20
        },
        "action": {
            "borderRadius": 0
        },
        "value": {
            "borderRadius": 0
        },
        "variable": {
            "borderRadius": 0,
            "height": 40
        },
        "point": {
            "height": 20,
            "padding": 5,
            "circle-size": 3
        },
        "background-grid": {
            "pattern-size": 10,
            "step-size": 5,
            "line": {
                "stroke": "rgba(0, 0, 0, 0.1)",
                "stroke-width": 2
            },
            "big-line": {
                "stroke": "rgba(0, 0, 0, 0.4)",
                "stroke-width": 3
            }
        }
    };

    /**
     *
     * @extends pandora.EventEmitter
     * @constructor
     */
    var Renderer = pandora.class_("Renderer", pandora.EventEmitter, function (graph, svg, config) {
        pandora.EventEmitter.call(this);

        /**
         * Renderer configuration.
         * @type {Object}
         */
        this._config = pandora.mergeObjects(config || {}, DEFAULT_CONFIG, true, true);

        /**
         * Graph reference.
         * @type {cg.Graph}
         * @private
         */
        this._graph = graph;

        /**
         * The root SVG node this renderer is attached to.
         * @type {d3.selection}
         * @private
         */
        this._svg = d3.select(svg);

        /**
         * The root group created.
         * @type {d3.selection}
         * @private
         */
        this._rootGroup = null;

        /**
         * The group layer.
         * @type {d3.selection}
         * @private
         */
        this._groupLayer = null;

        /**
         * The connection layer.
         * @type {d3.selection}
         * @private
         */
        this._connectionLayer = null;

        /**
         * The layer for temporary connections that are not attached yet to a block but to the cursor instead.
         * @type {null}
         * @private
         */
        this._cursorConnectionLayer = null;

        /**
         * The block layer.
         * @type {d3.selection}
         * @private
         */
        this._blockLayer = null;

        /**
         * If this graph is already rendered.
         * @type {boolean}
         * @private
         */
        this._rendered = false;

        /**
         * The zoom instance.
         * @type {d3.behavior.zoom}
         * @private
         */
        this._zoom = null;

        /**
         * Point used for matrix transformations.
         * @type {SVGPoint}
         * @private
         */
        this._svgPoint = null;

        /**
         * The selection rectangle.
         * @type {d3.selection}
         * @private
         */
        this._selectionRectangle = null;

        /**
         * The selection bounding box.
         * @type {pandora.Box2}
         * @private
         */
        this._selectionBox = new pandora.Box2();

        /**
         * Last selected entity.
         * @type {d3.selection}
         * @private
         */
        this._lastSelectedEntity = null;
    });

    /**
     *
     * @private
     */
    Renderer.prototype._initialize = function () {
        this._rootGroup = this._svg.append("svg:g");
        this._groupLayer = this._rootGroup.append("svg:g").attr("id", "group-layer");
        this._connectionLayer = this._rootGroup.append("svg:g").attr("id", "connection-layer");
        this._cursorConnectionLayer = this._rootGroup.append("svg:g").attr("id", "cursor-connection-layer");
        this._blockLayer = this._rootGroup.append("svg:g").attr("id", "block-layer");
        this._svgPoint = this._svg.node().createSVGPoint();
    };

    /**
     * Render the graph.
     */
    Renderer.prototype.render = function () {
        if (this._rendered) {
            this.emit("error", new cg.RendererError("Cannot re-render the graph"));
            return;
        }
        this._rendered = true;
        this._initialize();
        this._render();
        this._updateRendererCollisions();
        setTimeout(this._render.bind(this), 42); // TODO: Fix bad size.
        this._renderSelection();
        this._renderZoom();
        this._graph.on("entity.add", function () {
            this._render();
        }.bind(this));
        this._graph.on("entity.remove", function () {
            this._render();
        }.bind(this));
        this._graph.on("connection.add", function () {
            this._renderConnections(this.getConnections());
        }.bind(this));
        this._graph.on("connection.remove", function () {
            this._renderConnections(this.getConnections());
        }.bind(this));
    };

    /**
     * Return d3 selection for all entities.
     * @return {d3.selection}
     */
    Renderer.prototype.getEntities = function () {
        return this._rootGroup
            .selectAll("#group-layer > .group, #block-layer > .block");
    };

    /**
     * Return d3 selection for all groups.
     * @return {d3.selection}
     */
    Renderer.prototype.getGroups = function () {
        return this._groupLayer
            .selectAll(".group")
            .data(this._graph.groups(), function (group) {
                return group._id;
            });
    };

    /**
     * Return d3 selection for all blocks.
     * @return {d3.selection}
     */
    Renderer.prototype.getBlocks = function () {
        return this._blockLayer
            .selectAll(".block")
            .data(this._graph.blocks(), function (block) {
                return block._id;
            });
    };

    /**
     * Return d3 selection for all points.
     * @return {d3.selection}
     */
    Renderer.prototype.getPoints = function () {
        return this._blockLayer
            .selectAll(".points > .point");
    };
    /**
     * Return d3 selection for all connections.
     * @return {d3.selection}
     */
    Renderer.prototype.getConnections = function () {
        var pointId = function (point) {
            var block = point.block;
            return block._id + "@" + (point.index + (point.isInput ? 0 : block.inputs.length));
        };
        return this._connectionLayer
            .selectAll(".connection")
            .data(this._graph.connections, function (connection) {
                return pointId(connection._inputPoint) + "," + pointId(connection._outputPoint);
            });
    };

    /**
     * Return if there are selected entities.
     * @param rootOnly {Boolean?} return only selected entities with the graph as parent.
     * @return {Boolean}
     */
    Renderer.prototype.hasSelectedEntities = function (rootOnly) {
        return this.getSelectedEntities(rootOnly)[0].length > 0;
    };

    /**
     * Return the last selected entity.
     * @return {d3.selection|null}
     */
    Renderer.prototype.getLastSelectedEntity = function () {
        return this.hasSelectedEntities() ? this._lastSelectedEntity : null;
    };

    /**
     * Return all selected entities.
     * @param rootOnly {Boolean?} return only selected entities with the graph as parent.
     * @return {d3.selection}
     */
    Renderer.prototype.getSelectedEntities = function (rootOnly) {
        return this._rootGroup
            .selectAll(".group.selected, .block.selected")
            .filter(function (entity) {
                return !rootOnly || entity.parent === this._graph;
            }.bind(this));
    };

    /**
     * Return all selected connections.
     * @returns {*}
     */
    Renderer.prototype.getSelectedConnections = function () {
        return this._rootGroup.selectAll(".connection.selected");
    };

    /**
     * Remove select connections and entities.
     */
    Renderer.prototype.removeSelection = function () {
        var renderer = this;
        var selectedConnections = this.getSelectedConnections();
        var selectedEntities = this.getSelectedEntities();
        selectedConnections.each(function (selectedConnection) {
            renderer._graph.removeConnection(selectedConnection);
        });
        selectedEntities = selectedEntities.filter(function (entity) {
            var parentFound = false;
            selectedEntities.each(function (otherEntity) {
                if (entity.parent === otherEntity) {
                    parentFound = true;
                }
            });
            return !parentFound;
        });
        selectedEntities.each(function (selectedEntity) {
            renderer._graph.removeEntity(selectedEntity);
        });
    };

    /**
     * Create a group from selection, putting all selected root entities in the children of the newly created group.
     * @param id
     * @param name
     */
    Renderer.prototype.createGroupFromSelection = function (id, name) {
        var renderer = this;
        var selectedEntities = renderer.getSelectedEntities(true);
        var selectionBbox = renderer._getSelectionZoomedSVGBox(selectedEntities);
        var group = new cg.Group(id, name,
            new pandora.Vec2(
                selectionBbox.x - this._config.group.padding,
                selectionBbox.y - this._config.group.padding - this._config.group.heading
            ),
            new pandora.Vec2(
                selectionBbox.width + this._config.group.padding * 2,
                selectionBbox.height + this._config.group.padding * 2 + this._config.group.heading
            )
        );
        renderer._graph.addEntity(group, renderer._graph);
        selectedEntities.each(function (selectedEntity) {
            renderer._graph.moveEntity(selectedEntity, group);
        });
        group.emit("reorder");
        group.forEachChild(function (childEntity) {
            if (childEntity instanceof cg.Group) {
                childEntity.emit("reorder");
            }
        });
    };

    /**
     * Create an empty group in the center of the viewport.
     * @param id
     * @param name
     */
    Renderer.prototype.createEmptyGroup = function (id, name) {
        var group = new cg.Group(id, name,
            new pandora.Vec2(0, 0),
            new pandora.Vec2(
                this._config.group.defaultWidth,
                this._config.group.defaultHeight
            )
        );
        this._graph.addEntity(group, this._graph);
    };

    /**
     * Create a group from selection if there is a selection, or create an empty group.
     * @param id
     * @param name
     */
    Renderer.prototype.createSmartGroup = function (id, name) {
        if (this.hasSelectedEntities()) {
            return this.createGroupFromSelection(id, name);
        }
        return this.createEmptyGroup(id, name);
    };

    /**
     * Zoom to best fit all entities in the renderer.
     */
    Renderer.prototype.zoomToFit = function () {
        var svgBoundingRect = new pandora.Box2(this._svg.node().getBoundingClientRect());
        var scaleExtent = this._zoom.scaleExtent();
        var bbox = this._getBBox(this._rootGroup);
        var dx = bbox.width - bbox.x;
        var dy = bbox.height - bbox.y;
        var x = (bbox.x + bbox.width) / 2;
        var y = (bbox.y + bbox.height) / 2;
        var scale = pandora.clamp(0.9 / Math.max(dx / svgBoundingRect.width, dy / svgBoundingRect.height), scaleExtent[0], scaleExtent[1]);
        var translate = [svgBoundingRect.width / 2 - scale * x, svgBoundingRect.height / 2 - scale * y];
        this._svg
            .transition(350)
            .call(this._zoom.translate(translate).scale(scale).event);
    };

    return Renderer;

})();
/**
 * Update all collisions.
 * @private
 */
cg.Renderer.prototype._updateRendererCollisions = function () {
    var renderer = this;
    // Update entities positions.
    var entityPoints = [];
    this.getEntities().each(function (entity) {
        var bbox = renderer._getBBox(this);
        entityPoints.push({
            "box": new pandora.Box2(entity.absolutePosition.x, entity.absolutePosition.y, bbox.width, bbox.height),
            "node": this
        });
    });
    this._entitiesQuadTree = d3.geom.quadtree()
        .x(function (entityPoint) {
            return entityPoint.box.x;
        })
        .y(function (entityPoint) {
            return entityPoint.box.y;
        })
    (entityPoints);
    // Update points positions.
    var pointPoints = [];
    this.getPoints().each(function (point) {
        var position = renderer._getPointAbsolutePosition(point);
        pointPoints.push({
            "x": position.x,
            "y": position.y,
            "point": point
        });
    });
    this._pointsQuadTree = d3.geom.quadtree()
        .x(function (pointPoint) {
            return pointPoint.x;
        })
        .y(function (pointPoint) {
            return pointPoint.y;
        })
    (pointPoints);
};

/**
 * Return all entities contained in the box.
 * @param selectionBox {pandora.Box2}
 * @return {d3.selection}
 * @private
 */
cg.Renderer.prototype._getEntitiesInArea = function (selectionBox) {
    var potentials = [];
    this._entitiesQuadTree.visit(function (node, x1, y1, x2, y2) {
        var entityPoint = node.point;
        if (entityPoint) {
            if (selectionBox.collide(entityPoint.box)) {
                potentials.push(entityPoint.node);
            }
        }
        return false; // TODO: Optimize this.
    });
    return d3.selectAll(potentials);
};

/**
 * Get the nearest point of the given box.
 * @param box {pandora.Box2}
 * @private
 */
cg.Renderer.prototype._getNearestPointInArea = function (box) {
    var point = this._pointsQuadTree.find([box.x + box.width / 2, box.y + box.height / 2]).point;
    return box.collide(this._getPointAbsolutePosition(point)) ? point : null;
};
/**
 * Utility to send a d3 selection to front.
 * @returns {d3.selection}
 */
// TODO: remove this.
d3.selection.prototype.moveToFront = function () {
    return this.each(function () {
        this.parentNode.appendChild(this);
    });
};
cg.RendererError = (function () {

    /**
     * Handle renderer related errors.
     * @constructor
     */
    return pandora.class_("RendererError", function () {
        return pandora.Exception.apply(this, arguments);
    });

})();
cg.Renderer.Point = (function () {

    /**
     * Represent a point which is created at the cursor position, used to create connections.
     * @param sourcePoint {cg.Point}
     * @param position {pandora.Vec2}
     * @constructor
     */
    return pandora.class_("Point", pandora.EventEmitter, function (sourcePoint, position) {
        pandora.EventEmitter.call(this);

        /**
         * Point type.
         * @type {Number}
         * @private
         */
        this._type = sourcePoint.type;
        Object.defineProperty(this, "type", {
            get: function () { return this._type; }.bind(this)
        });

        /**
         * Point position.
         * @type {pandora.Vec2}
         * @private
         */
        this._position = position;
        Object.defineProperty(this, "position", {
            get: function () { return this._position; }.bind(this)
        });

        /**
         * Point is input.
         * @type {boolean}
         * @private
         */
        this._isInput = !sourcePoint.isInput;
        Object.defineProperty(this, "isInput", {
            get: function () { return this._isInput; }.bind(this)
        });

        /**
         * Point source point.
         * @type {cg.Point}
         * @private
         */
        this._sourcePoint = sourcePoint;
        Object.defineProperty(this, "sourcePoint", {
            get: function () { return this._sourcePoint; }.bind(this)
        });
    });

})();
/**
 * Return SVG offset origin.
 * @return {pandora.Vec2}
 * @private
 */
cg.Renderer.prototype._getSVGOrigin = function () {
    var svgBoundingRect = this._svg.node().getBoundingClientRect();
    return new pandora.Vec2(svgBoundingRect.left, svgBoundingRect.top);
};

/**
 * Return an event point in zoomed SVG coordinates.
 * @param x {Number}
 * @param y {Number}
 * @param ignoreOrigin {Boolean?} Ignore the SVG offset
 * @return {pandora.Vec2}
 * @private
 */
cg.Renderer.prototype._getZoomedSVGPosition = function (x, y, ignoreOrigin) {
    if (!ignoreOrigin) {
        var svgOrigin = this._getSVGOrigin();
        this._svgPoint.x = x - svgOrigin.x;
        this._svgPoint.y = y - svgOrigin.y;
    } else {
        this._svgPoint.x = x;
        this._svgPoint.y = y;
    }
    var position = this._svgPoint.matrixTransform(this._rootGroup.node().getCTM().inverse());
    return new pandora.Vec2(position);
};

/**
 * Get zoomed touch position (mouse for desktop or first touch for mobile.)
 * @param e {Event}
 * @private
 */
cg.Renderer.prototype._getZoomedTouchPosition = function (e) {
    if (e.clientX && e.clientY) {
        return this._getZoomedSVGPosition(e.clientX, e.clientY);
    } else if (e.touches[0]) {
        return this._getZoomedSVGPosition(e.touches[0].clientX, e.touches[0].clientY);
    }
};

/**
 * Return the zoomed viewport.
 * @return {pandora.Box2}
 * @private
 */
cg.Renderer.prototype._getSVGViewport = function () {
    var svgBoundingRect = this._svg.node().getBoundingClientRect();
    var topLeft = this._getZoomedSVGPosition(svgBoundingRect.left, svgBoundingRect.top, true);
    var bottomRight = this._getZoomedSVGPosition(svgBoundingRect.right, svgBoundingRect.bottom, true);
    return new pandora.Box2(topLeft.x, topLeft.y, bottomRight.x - topLeft.x, bottomRight.y - topLeft.y);
};

/**
 * Return the bounding box of the element
 * @param element {d3.selection|element}
 * @return {{x: Number, y: Number, width: Number, height: Number}}
 * @private
 */
// TODO: Workaround for Polymer Webcomponents getBBox bug on IE11.
cg.Renderer.prototype._getBBox = function (element) {
    var unwrap_wrapper = unwrap || function (el) {
            return el;
        };
    return pandora.polymorphic(element, {
        "Array": function () {
            return unwrap_wrapper(element.node()).getBBox();
        },
        "Object": function () {
            return unwrap_wrapper(element).getBBox();
        }
    });
};

/**
 * Return the bbox of the d3 selection in zoomed SVG coordinates.
 * @param d3selection {d3.selection}
 * @return {pandora.Box2|null}
 * @private
 */
//TODO: Fix this method, it's broken.
cg.Renderer.prototype._getSelectionZoomedSVGBox = function (d3selection) {
    var renderer = this;
    var boundingConverter = new pandora.Box2();
    var bbox = null;
    d3selection.each(function () {
        var elementBBox = boundingConverter.assign(this.getBoundingClientRect());
        var zoomedPosition = renderer._getZoomedSVGPosition(elementBBox.x, elementBBox.y);
        var zoomedSize = renderer._getZoomedSVGPosition(elementBBox.x + elementBBox.width, elementBBox.y + elementBBox.height);
        var box = {"left": zoomedPosition.x, "top": zoomedPosition.y, "right": zoomedSize.x, "bottom": zoomedSize.y};
        if (!bbox) {
            bbox = pandora.mergeObjects({}, box);
        } else {
            bbox.left = Math.min(bbox.left, box.left);
            bbox.top = Math.min(bbox.top, box.top);
            bbox.right = Math.max(bbox.right, box.right);
            bbox.bottom = Math.max(bbox.bottom, box.bottom);
        }
    });
    if (bbox) {
        return boundingConverter.assign(bbox);
    }
    return null;
};
/**
 * Render the graph.
 * @private
 */
cg.Renderer.prototype._render = function() {
    this._renderGroups(this.getGroups());
    this._renderBlocks(this.getBlocks());
    this._renderConnections(this.getConnections());
};
/**
 * Cursor connections.
 * @type {Array<cg.Connection>}
 */
var cursorConnections = [];

/**
 * Next cursor connection id for data-binding.
 * @type {number}
 */
var nextCursorConnectionId = 0;

/**
 * Add the cursor connection to the list of cursor connections drawn on the screen.
 * @param cursorConnection {cg.Connection}
 * @return {cg.Connection}
 */
var addCursorConnection = function (cursorConnection) {
    cursorConnection.data.cursorConnectionId = nextCursorConnectionId++;
    cursorConnections.push(cursorConnection);
    return cursorConnection;
};

/**
 * Remove the cursor connection to the list of cursor connections drawn on the screen.
 * @param cursorConnection {cg.Connection}
 */
var removeCursorConnection = function (cursorConnection) {
    delete cursorConnection.data.cursorConnectionId;
    return cursorConnections.splice(cursorConnections.indexOf(cursorConnection), 1)[0];
};

/**
 * Return the list of cursor connections drawn on the screen.
 * @return {d3.selection}
 * @private
 */
var getCursorPointConnections = function () {
    return renderer._cursorConnectionLayer
        .selectAll(".connection")
        .data(cursorConnections, function (cursorConnection) {
            return cursorConnection.data.cursorConnectionId;
        });
};

/**
 * Render the block points.
 * @param blockPointsGroup {d3.selection}
 * @private
 */
cg.Renderer.prototype._renderPoints = function (blockPointsGroup) {
    var points = blockPointsGroup
        .selectAll("g")
        .data(function (block) { return block.inputs.concat(block.outputs); });
    this._createPoints(points);
    this._updatePoints(points);
    this._removePoints(points);
};

/**
 * Create the points.
 * @param points {d3.selection}
 * @private
 */
cg.Renderer.prototype._createPoints = function (points) {
    var renderer = this;
    var pointGroup = points
        .enter()
        .append("svg:g")
        .attr({
            "class": function (point) { return "point type-" + point.type + " " + (point.isInput ? "input" : "output"); }
        });
    pointGroup
        .call(d3.behavior.drag()
            .origin(function (point) {
                return renderer._getPointAbsolutePosition(point);
            })
            .on("dragstart", function () {
                var pointElement = d3.select(this);
                var point = pointElement.datum();
                if (d3.event.sourceEvent.altKey && point.connections.length > 0) {
                    point.disconnect();
                    return;
                }
                if (point.data.cursorPoint) {
                    cursorConnections.splice(cursorConnections.indexOf(point.data.cursorConnection), 1);
                }
                var touchPosition = renderer._getZoomedTouchPosition(d3.event.sourceEvent);
                point.data.cursorPoint = new cg.Renderer.Point(point, touchPosition);
                point.data.cursorConnection = new cg.Connection(point.data.cursorPoint, point);
                addCursorConnection(point.data.cursorConnection);
                renderer._renderConnections(getCursorPointConnections());
                pandora.preventCallback(d3.event.sourceEvent);
            })
            .on("drag", function () {
                var point = d3.select(this).datum();
                point.data.cursorPoint.position.x += d3.event.dx;
                point.data.cursorPoint.position.y += d3.event.dy;
                point.data.cursorPoint.emit("move");
            })
            .on("dragend", function () {
                var r = 20;
                var point = d3.select(this).datum();
                var connection = removeCursorConnection(point.data.cursorConnection);
                var pointArea = new pandora.Box2(point.data.cursorPoint.position.subtract(r / 2, r / 2), new pandora.Vec2(r, r));
                var newPoint = renderer._getNearestPointInArea(pointArea);
                if (newPoint !== null && connection.replacePoint(point.data.cursorPoint, newPoint)) {
                    renderer._graph.addConnection(connection);
                } else {
                    renderer._graph.emit("error", new cg.GraphError("No " + (point.data.cursorPoint.isInput ? "input" : "output") + " found around"));
                }
                renderer._removeConnections(getCursorPointConnections());
                delete point.data.cursorPoint;
                delete point.data.cursorConnection;
            })
        )
        .each(function(point) {
            d3.select(this)
                .append("svg:circle")
                .attr({
                    "class": "circle"
                });
            pandora.polymorphic(point.block.model, {
                "Action": function () {
                    d3.select(this)
                        .append("svg:text")
                        .attr({
                            "class": "description",
                            "text-anchor": function (point) { return point.isInput ? "start" : "end"; }
                        });
                }.bind(this),
                "_": pandora.defaultCallback
            });
            var updatePoint = renderer._updatePoints.bind(renderer, d3.select(this));
            point.on("connection.add", updatePoint);
            point.on("connection.remove", updatePoint);
        });
};

/**
 * Update the points.
 * @param points {d3.selection}
 * @private
 */
cg.Renderer.prototype._updatePoints = function (points) {
    var renderer = this;
    points
        .attr({
            "transform": function (point) {
                var value = this._getPointRelativePosition(point).toArray();
                pandora.polymorphic(point.block.model, {
                    "Action": pandora.defaultCallback,
                    "Variable": function () { value[1] = renderer._config.block.heading / 2; },
                    "Value": function () { value[1] = renderer._config.block.heading / 2; }
                });
                return "translate(" + value + ")";
            }.bind(this)
        });
    var circles = points
        .select(".circle")
        .attr({
            "r": this._config.point["circle-size"],
            "x": 0,
            "y" : 0
        });
    circles.classed("empty", function (point) { return !point.connections.length; });
    points
        .select(".description")
        .text(function(point) { return point.name; })
        .attr({
            "x": function(point) { return (point.isInput ? 1 : -1) * (this._config.point["circle-size"] * 2 + this._config.point.padding); }.bind(this),
            "y": this._config.point["circle-size"]
        });
    points
        .each(function(point) {
            point.block.data.pointHeight = renderer._config.point.height;
            if (point.isInput) {
                point.block.data.maxInputWidth = Math.max(point.block.data.maxInputWidth, renderer._getBBox(this).width);
            } else {
                point.block.data.maxOutputWidth = Math.max(point.block.data.maxOutputWidth, renderer._getBBox(this).width);
            }
        });
};

/**
 * Remove the points.
 * @param points {d3.selection}
 * @private
 */
cg.Renderer.prototype._removePoints = function (points) {
    points
        .exit()
        .remove();
};

/**
 * Get relative point position in action
 * @param point {cg.Point}
 * @returns {pandora.Vec2}
 * @private
 */
cg.Renderer.prototype._getPointRelativePosition = function (point) {
    if (point.block.data.computedWidth === undefined) {
        return new pandora.Vec2();
    }
    return new pandora.Vec2(
        point.isInput ? this._config.block.padding : point.block.data.computedWidth - this._config.block.padding,
        point.block.data.computedHeadingOffset + point.index * this._config.point.height
    );
};

/**
 * Get absolute point position
 * @param point {cg.Point}
 * @returns {pandora.Vec2}
 * @private
 */
cg.Renderer.prototype._getPointAbsolutePosition = function (point) {
    if (point instanceof cg.Point) {
        return point.block.absolutePosition.add(this._getPointRelativePosition(point));
    }
    return point.position;
};
/**
 * Render connections.
 * @private
 */
cg.Renderer.prototype._renderConnections = function (connections) {
    this._updateGroupMasks();
    this._createConnections(connections);
    this._updateConnections(connections);
    this._removeConnections(connections);
};

/**
 * Create connections.
 * @param connections {d3.selection}
 * @private
 */
cg.Renderer.prototype._createConnections = function (connections) {
    var renderer = this;
    connections
        .enter()
        .append("svg:path")
        .attr({
            "class": function (connection) { return ["connection", "empty", "type-" + connection.outputPoint.type].join(" "); },
            "style": "stroke-width: 2px;"
        })
        .on("mousedown", function () {
            var connectionElement = d3.select(this);
            connectionElement.classed("selected", !connectionElement.classed("selected"));
            pandora.preventCallback(d3.event);
        })
        .each(function (connection) {
            var updatePath = renderer._updateConnections.bind(renderer, d3.select(this));
            if (connection.outputPoint instanceof cg.Point) {
                connection.outputPoint.block.on("move", updatePath);
            } else {
                connection.outputPoint.on("move", updatePath);
            }
            if (connection.inputPoint instanceof cg.Point) {
                connection.inputPoint.block.on("move", updatePath);
            } else {
                connection.inputPoint.on("move", updatePath);
            }
        });
};

/**
 * Update connections.
 * @param connections {d3.selection}
 * @private
 */
cg.Renderer.prototype._updateConnections = function (connections) {
    connections
        .attr({
            "d": function (connection) {
                var p1 = this._getPointAbsolutePosition(connection.outputPoint);
                var p2 = this._getPointAbsolutePosition(connection.inputPoint);
                var step = Math.max(0.5 * (p1.x - p2.x) + 200, 50);
                return pandora.formatString("M{x},{y}C{x1},{y1} {x2},{y2} {x3},{y3}", {
                    x: p1.x, y: p1.y,
                    x1: p1.x + step, y1: p1.y,
                    x2: p2.x - step, y2: p2.y,
                    x3: p2.x, y3: p2.y
                });
            }.bind(this)
        });
};

/**
 * Remove connections.
 * @param connections {d3.selection}
 * @private
 */
cg.Renderer.prototype._removeConnections = function (connections) {
    connections
        .exit()
        .remove();
};
/**
 * Render groups.
 * @private
 */
cg.Renderer.prototype._renderGroups = function (groups) {
    this._updateGroupMasks();
    this._createGroups(groups);
    this._heavyUpdateGroups(groups);
    this._removeGroups(groups);
};

/**
 * Update group masks to hide overflow in title.
 * @private
 */
cg.Renderer.prototype._updateGroupMasks = function() {
    var masks = this._svg
        .append("svg:defs")
        .selectAll(".group-text-mask")
        .data(this._graph.groups(), function(group) { return group._id; });
    masks
        .enter()
        .append("svg:mask")
        .attr({
            "id": function (group) { return "group-mask-" + group._id; },
            "class": "group-text-mask"
        })
        .append("svg:rect")
        .attr({
            "fill": "white"
        });
    masks
        .select("rect")
        .attr({
            "x": this._config.group.padding,
            "y": 0,
            "width": function (group) { return group.size.x - this._config.group.padding * 2;}.bind(this),
            "height": function (group) { return group.size.y; }
        });
    masks
        .exit()
        .remove();
};

/**
 * Create groups.
 * @param groups {d3.selection}
 * @private
 */
cg.Renderer.prototype._createGroups = function (groups) {
    var createdGroups = groups
        .enter()
        .append("svg:g")
        .attr({
            "class": "group"
        });
    createdGroups
        .append("svg:rect")
        .attr({
            "class": "group-rect background"
        });
    createdGroups
        .append("svg:text")
        .attr({
            "class": "group-text title",
            "text-anchor": "middle",
            "mask": function (group) { return "url('#group-mask-" + group._id + "')"; }
        });
    createdGroups
        .call(this._doubleClick())
        .call(this._renderDrag())
        .each(function (group) {
                group.on("move", renderer._lightUpdateGroups.bind(renderer, d3.select(this)));
                group.on("update", renderer._heavyUpdateGroups.bind(renderer, d3.select(this)));
                group.on("reorder", d3.selection.prototype.moveToFront.bind(d3.select(this)));
        });
};

/**
 * Update group position.
 * @param groups {d3.selection}
 * @private
 */
cg.Renderer.prototype._lightUpdateGroups = function (groups) {
    groups
        .attr("transform", function (group) { return "translate(" + group.absolutePosition.toArray() + ")"; });
};

/**
 * Update groups.
 * @param groups {d3.selection}
 * @private
 */
cg.Renderer.prototype._heavyUpdateGroups = function (groups) {
    groups
        .attr("transform", function (group) { return "translate(" + group.absolutePosition.toArray() + ")"; });
    groups
        .select(".group-rect")
        .attr({
            rx: this._config.group.borderRadius,
            ry: this._config.group.borderRadius,
            x: 0,
            y: 0,
            width: function (group) { return group.size.x; },
            height: function (group) { return group.size.y; }
        });
    groups
        .select(".group-text")
        .text(function (group) { return group.description; })
        .attr({
            x: function (group) { return group.size.x / 2; },
            y: this._config.group.heading
        });
};

/**
 * Remove groups.
 * @param groups {d3.selection}
 * @private
 */
cg.Renderer.prototype._removeGroups = function (groups) {
    groups
        .exit()
        .remove();
};
/**
 * Render blocks.
 * @private
 */
cg.Renderer.prototype._renderBlocks = function (blocks) {
    this._createBlocks(blocks);
    this._heavyUpdateBlocks(blocks);
    this._removeBlocks(blocks);
};

/**
 * Create blocks.
 * @param blocks {d3.selection}
 * @private
 */
cg.Renderer.prototype._createBlocks = function (blocks) {
    var renderer = this;
    var createdBlocks = blocks
        .enter()
        .append("svg:g")
        .attr({
            "class": "block"
        });
    createdBlocks
        .append("svg:rect")
        .attr({
            "class": "background"
        });
    createdBlocks
        .append("svg:g")
        .attr({
            "class": "points"
        })
        .each(function(block) {
            block.data.maxInputWidth = 0;
            block.data.maxOutputWidth = 0;
            block.data.pointHeight = 0;
        });
    createdBlocks
        .call(this._doubleClick())
        .call(this._renderDrag())
        .each(function (block) {
            pandora.polymorphicMethod(renderer, "createBlock", block.model, block, d3.select(this));
            block.on("move", renderer._lightUpdateBlocks.bind(renderer, d3.select(this)));
            block.on("update", renderer._heavyUpdateBlocks.bind(renderer, d3.select(this)));
            block.on("reorder", d3.selection.prototype.moveToFront.bind(d3.select(this)));
        });
};

/**
 * Create the action block.
 * @param model {cg.Model}
 * @param block {cg.Block}
 * @param element {d3.selection}
 * @private
 */
cg.Renderer.prototype._createBlockAction = function (model, block, element) {
    element.classed(model.type, true);
    element.append("svg:text").attr({
        "class": "title",
        "text-anchor": "middle",
        "alignment-baseline": "baseline"
    });
};

/**
 * Create the variable block.
 * @param model {cg.Model}
 * @param block {cg.Block}
 * @param element {d3.selection}
 * @private
 */
cg.Renderer.prototype._createBlockVariable = function (model, block, element) {
    element.classed(model.type, true);
    element.classed("type-" + block.model.valueType, true);
    element.append("svg:text").attr({
        "class": "title",
        "text-anchor": "start",
        "alignment-baseline": "middle"
    });
};

/**
 * Create the value block.
 * @param model {cg.Model}
 * @param block {cg.Block}
 * @param element {d3.selection}
 * @private
 */
cg.Renderer.prototype._createBlockValue = function (model, block, element) {
    element.classed(model.type, true);
    element.classed("type-" + block.model.valueType, true);
    var className = pandora.camelcase(block.model.valueType, "-");
    if (this["_createValue" + className] === undefined) {
        this.emit("error", new pandora.MissingOverloadError("createValue" + className, "Renderer"));
    } else {
        this["_createValue" + className](block, element);
    }
};

/**
 * Update blocks position.
 * @param blocks {d3.selection}
 * @private
 */
cg.Renderer.prototype._lightUpdateBlocks = function (blocks) {
    blocks
        .attr("transform", function (block) { return "translate(" + block.absolutePosition.toArray() + ")"; });
};

/**
 * Update blocks.
 * @param blocks {d3.selection}
 * @private
 */
cg.Renderer.prototype._heavyUpdateBlocks = function (blocks) {
    var renderer = this;
    blocks
        .attr("transform", function (block) { return "translate(" + block.absolutePosition.toArray() + ")"; });
    var blockPointsGroup = blocks
        .select(".points");
    this._renderPoints(blockPointsGroup);
    blocks
        .select(".background")
        .attr({
            rx: function (block) { return this._config[block.model.type].borderRadius; }.bind(this),
            ry: function (block) { return this._config[block.model.type].borderRadius; }.bind(this),
            x: 0,
            y: 0
        });
    blocks.each(function (block) {
        var element = d3.select(this);
        pandora.polymorphicMethod(renderer, "updateBlock", block.model, block, element);
        element.select(".background").attr({
            width: block.data.computedWidth,
            height: block.data.computedHeight
        });
    });
    this._renderPoints(blockPointsGroup);
};

/**
 * Update the action block.
 * @param model {cg.Model}
 * @param block {cg.Block}
 * @param element {d3.selection}
 * @private
 */
cg.Renderer.prototype._updateBlockAction = function (model, block, element) {
    element.select(".title").text(block._name);
    block.data.computedWidth = renderer._config.block.padding * 2;
    block.data.computedWidth += Math.max(
        this._getBBox(element.select(".title")).width,
        block.data.maxInputWidth + block.data.maxOutputWidth + renderer._config.block.centerSpacing
    );
    block.data.computedHeight = renderer._config.block.heading;
    block.data.computedHeight += block.data.pointHeight * Math.max(block.inputs.length, block.outputs.length);
    block.data.computedHeadingOffset = renderer._config.block.heading;
    element.select(".title").attr({x: block.data.computedWidth / 2, y: this._config.block.padding});
};

/**
 * Update the variable block.
 * @param model {cg.Model}
 * @param block {cg.Block}
 * @param element {d3.selection}
 * @private
 */
cg.Renderer.prototype._updateBlockVariable = function (model, block, element) {
    element.select(".title")
        .attr({x: this._config.block.padding, y: this._config.block.padding})
        .text(block._name);
    block.data.computedWidth = renderer._config.block.padding * 2;
    block.data.computedWidth += this._getBBox(element.select(".title")).width;
    block.data.computedWidth += renderer._config.block.padding + renderer._config.point['circle-size'];
    block.data.computedHeight = renderer._config.block.heading;
    block.data.computedHeadingOffset = block.data.computedHeight / 2;
};

/**
 * Update the value block.
 * @param model {cg.Model}
 * @param block {cg.Block}
 * @param element {d3.selection}
 * @private
 */
cg.Renderer.prototype._updateBlockValue = function (model, block, element) {
    block.data.computedWidth = renderer._config.block.padding * 2;
    var className = pandora.camelcase(block.model.valueType, "-");
    if (this["_updateValue" + className] === undefined) {
        this.emit("error", new pandora.MissingOverloadError("updateValue" + className, "Renderer"));
    } else {
        this["_updateValue" + className](block, element);
    }
    block.data.computedWidth += renderer._config.block.padding + renderer._config.point['circle-size'];
    block.data.computedHeight = renderer._config.block.heading;
    block.data.computedHeadingOffset = block.data.computedHeight / 2;
};

/**
 * Remove blocks.
 * @param blocks {d3.selection}
 * @private
 */
cg.Renderer.prototype._removeBlocks = function (blocks) {
    blocks
        .exit()
        .remove();
};
cg.Renderer.prototype._createValueText = function (block, element) {
    element.append("svg:text").attr({
        "class": "title",
        "text-anchor": "start",
        "alignment-baseline": "middle"
    });
};

cg.Renderer.prototype._updateValueText = function (block, element, text) {
    element.select(".title")
        .attr({x: this._config.block.padding, y: this._config.block.padding})
        .text(text);
    block.data.computedWidth += this._getBBox(element.select(".title")).width;
};

cg.Renderer.prototype._createValueBoolean = function (block, element) {
    this._createValueText(block, element);
};

cg.Renderer.prototype._updateValueBoolean = function (block, element) {
    this._updateValueText(block, element, block.value ? "true" : "false");
};

cg.Renderer.prototype._createValueNumber = function (block, element) {
    this._createValueText(block, element);
};

cg.Renderer.prototype._updateValueNumber = function (block, element) {
    this._updateValueText(block, element, block.value);
};

cg.Renderer.prototype._createValueSound = function (block, element) {
    this._createValueText(block, element);
};

cg.Renderer.prototype._updateValueSound = function (block, element) {
    this._updateValueText(block, element, block.value);
};

cg.Renderer.prototype._createValueString = function (block, element) {
    this._createValueText(block, element);
};

cg.Renderer.prototype._updateValueString = function (block, element) {
    this._updateValueText(block, element, "\"" + block.value + "\"");
};

cg.Renderer.prototype._createValueVec2 = function (block, element) {
    this._createValueText(block, element);
};

cg.Renderer.prototype._updateValueVec2 = function (block, element) {
    this._updateValueText(block, element, "Vec2(" + block.value.join(", ") + ")");
};

cg.Renderer.prototype._createValueVec3 = function (block, element) {
    this._createValueText(block, element);
};

cg.Renderer.prototype._updateValueVec3 = function (block, element) {
    this._updateValueText(block, element, "Vec3(" + block.value.join(", ") + ")");
};

cg.Renderer.prototype._createValueColor = function (block, element) {
    element.append("svg:rect")
        .attr({
            "class": "color-rect",
            "rx": this._config.block.borderRadius,
            "ry": this._config.block.borderRadius,
            "width": 40,
            "height": 20,
            "fill": block.value,
            "stroke": block.value
        });
};

cg.Renderer.prototype._updateValueColor = function (block, element) {
    var rect = element.select(".color-rect");
    block.data.computedWidth += parseInt(rect.attr("width"));
    element.select(".color-rect").attr({
        "x": this._config.block.padding,
        "y": rect.attr("height") / 2
    });
};
/**
 * Enable zoom.
 * @private
 */
cg.Renderer.prototype._renderZoom = function() {
    this._zoom = d3.behavior.zoom()
        .scaleExtent([this._config.zoom.minZoom, this._config.zoom.maxZoom])
        .on('zoom', function () {
            if (d3.event.sourceEvent) {
                pandora.preventCallback(d3.event.sourceEvent);
            }
            this._rootGroup.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
        }.bind(this));
    this._svg.call(this._zoom);
};
/**
 * Enable edit on double click.
 * @private
 */
cg.Renderer.prototype._doubleClick = function () {
    var renderer = this;
    return function () {
        this.on("dblclick", function (entity) {
            renderer.emit("entity.edit", entity);
            pandora.preventCallback(d3.event);
        });
    };
};

/**
 * Enable drag and drop of blocks and groups.
 * @private
 */
cg.Renderer.prototype._renderDrag = function () {
    var renderer = this;
    return d3.behavior.drag()
        .on("dragstart", function () {
            var node = d3.select(this);
            renderer._addEntitiesToSelection(node, !d3.event.sourceEvent.shiftKey);
            var selected = renderer.getSelectedEntities();
            selected.each(function (entity) {
                if (entity.parent !== renderer._graph) {
                    renderer._graph.moveEntity(entity, renderer._graph);
                }
                entity.emit("reorder");
                if (entity instanceof cg.Group) {
                    entity.forEachChild(function (childEntity) {
                        if (childEntity instanceof cg.Group) {
                            childEntity.emit("reorder");
                        }
                    });
                }
            });
            pandora.preventCallback(d3.event.sourceEvent);
        })
        .on("drag", function () {
            var selected = renderer.getSelectedEntities();
            selected.each(function (entity) {
                entity.position.x += d3.event.dx;
                entity.position.y += d3.event.dy;
                entity.emit("move");
                if (entity instanceof cg.Group) {
                    entity.forEachChild(function (childEntity) {
                        childEntity.emit("move");
                    });
                }
            });
        })
        .on("dragend", function () {
            renderer._updateRendererCollisions();
            var selected = renderer.getSelectedEntities();
            selected.each(function (entity) {
                var dropBox = new pandora.Box2(entity.absolutePosition.x, entity.absolutePosition.y, renderer._getBBox(this).width, renderer._getBBox(this).height);
                var possible = renderer._getEntitiesInArea(dropBox);
                possible.each(function (possibleEntity) {
                    //noinspection JSPotentiallyInvalidUsageOfThis
                    var possibleDropBox = new pandora.Box2(possibleEntity.absolutePosition.x, possibleEntity.absolutePosition.y, renderer._getBBox(this).width, renderer._getBBox(this).height);
                    if (possibleEntity !== entity && possibleDropBox.contain(dropBox)) {
                        renderer._graph.moveEntity(entity, possibleEntity);
                    }
                });
            });
        });
};
/**
 * Enable selection.
 * @private
 */
cg.Renderer.prototype._renderSelection = function () {
    var renderer = this;
    var origin = null;
    this._svg.on('mousedown', function() {
        renderer.getSelectedEntities().each(function () {
            renderer._clearSelection();
        });
    });
    this._svg.call(d3.behavior.drag()
            .on('dragstart', function () {
                if (d3.event.sourceEvent.shiftKey) {
                    pandora.preventCallback(d3.event.sourceEvent);
                    renderer._selectionRectangle = renderer._rootGroup.append("svg:rect");
                    renderer._selectionRectangle.attr({
                        "id": "selection"
                    });
                    origin = null;
                }
            })
            .on('drag', function () {
                if (renderer._selectionRectangle) {
                    if (origin === null) {
                        origin = renderer._getZoomedSVGPosition(d3.event.x, d3.event.y, true);
                        renderer._selectionBox.x = origin.x;
                        renderer._selectionBox.y = origin.y;
                        renderer._selectionBox.width = 0;
                        renderer._selectionBox.height = 0;
                    }
                    var position = renderer._getZoomedSVGPosition(d3.event.x, d3.event.y, true);
                    renderer._selectionBox.assign(origin.x, origin.y, position.x - origin.x, position.y - origin.y);
                    if (renderer._selectionBox.width < 0) {
                        renderer._selectionBox.x = position.x;
                        renderer._selectionBox.width = origin.x - position.x;
                    }
                    if (renderer._selectionBox.height < 0) {
                        renderer._selectionBox.y = position.y;
                        renderer._selectionBox.height = origin.y - position.y;
                    }
                    renderer._selectionRectangle.attr({
                        x: renderer._selectionBox.x,
                        y: renderer._selectionBox.y,
                        width: renderer._selectionBox.width,
                        height: renderer._selectionBox.height
                    });
                }
            })
            .on('dragend', function () {
                if (renderer._selectionRectangle) {
                    renderer._selectionRectangle.remove();
                    renderer._selectionRectangle = null;
                }
                if (d3.event.sourceEvent.shiftKey) {
                    var selectedEntities = renderer._getEntitiesInArea(renderer._selectionBox);
                    renderer._addEntitiesToSelection(selectedEntities);
                }
            })
    );
};

/**
 * Clear the selection.
 * @private
 */
cg.Renderer.prototype._clearSelection = function() {
    this._lastSelectedEntity = null;
    this.getSelectedEntities().classed("selected", false);
};

/**
 * Add entities to selection.
 * @param entitiesSelection {d3.selection}
 * @param clearSelection {Boolean?} clear the previous selection
 */
cg.Renderer.prototype._addEntitiesToSelection = function(entitiesSelection, clearSelection) {
    if (clearSelection) {
        this._clearSelection();
    }
    if (entitiesSelection) {
        if (entitiesSelection.length === 1) {
            this._lastSelectedEntity = d3.select(entitiesSelection[0][0]);
        }
        entitiesSelection.classed("selected", true);
    }
};
cg.JSONLoader = (function () {

    /**
     * Load a graph from JSON data.
     * @constructor
     */
    var JSONLoader = pandora.class_("JSONLoader", pandora.EventEmitter, function () {
        pandora.EventEmitter.call(this);
        this._blocks = [];
    });

    /**
     *
     * @param graph
     * @param data
     */
    JSONLoader.prototype.load = function (graph, data) {
        pandora.forEach(data, function (obj, name) {
            var loader = this["_load" + pandora.camelcase(name, "-")];
            if (loader) {
                loader.call(this, obj, graph);
            } else {
                this.emit("error", new pandora.MissingOverloadError("load" + pandora.camelcase(name, "-"), "JSONLoader"));
            }
        }.bind(this));
    };

    JSONLoader.prototype._loadTypes = function (typesData, graph) {
        graph.types = typesData;
        for (var i = 0; i < typesData.length; ++i) {
            graph.addModel(new cg.Value({"value-type": typesData[i]}));
        }
    };

    /**
     *
     * @param modelsData
     * @param graph
     * @private
     */
    JSONLoader.prototype._loadModels = function (modelsData, graph) {
        pandora.forEach(modelsData, function (model, name) {
            model.name = name;
            graph.addModel(new cg[pandora.camelcase(model.type, "-")](model));
        });
    };

    /**
     *
     * @param {cg.Graph} graph
     * @param {Object} modelsData
     * @private
     */
    JSONLoader.prototype._loadChildren = function (modelsData, graph) {
        pandora.forEach(modelsData, function (model) {
            this.loadEntity(model, graph, graph);
        }.bind(this));
    };

    /**
     *
     * @param {Object} connectionsData
     * @param {cg.Graph} graph
     * @private
     */
    JSONLoader.prototype._loadConnections = function (connectionsData, graph) {
        pandora.forEach(connectionsData, function (connectionData) {
            var firstBlock = this._blocks[connectionData.from.block];
            var secondBlock = this._blocks[connectionData.to.block];
            if (!firstBlock) {
                this.emit("error", new pandora.Exception('Connection "from block" not found'), connectionData, connectionData.from.block);
            }
            if (!secondBlock) {
                this.emit("error", new pandora.Exception('Connection "to block" not found'), connectionData, connectionData.to.block);
            }
            var firstPoint = firstBlock.getPoint(connectionData.from.point, "outputs");
            var secondPoint = secondBlock.getPoint(connectionData.to.point, "inputs");
            if (!firstPoint) {
                this.emit("error", new pandora.Exception('Connection "from block point" not found'), connectionData, connectionData.from.block, connectionData.from.point);
            }
            if (!secondPoint) {
                this.emit("error", new pandora.Exception('Connection "to block point" not found'), connectionData, connectionData.to.block, connectionData.to.point);
            }
            var connection = new cg.Connection(firstPoint, secondPoint);
            graph.addConnection(connection);
        }.bind(this));
    };

    /**
     * Load a cg.Entity.
     * @param {Object} entityData
     * @param {cg.Graph} graph
     * @param {cg.Entity} parent
     * @returns {cg.Entity}
     */
    JSONLoader.prototype.loadEntity = function (entityData, graph, parent) {
        var entityLoader = this["_load" + pandora.camelcase("entity-" + entityData._type, "-")];
        if (entityLoader) {
            entityLoader.call(this, entityData, graph, parent);
        } else {
            this.emit("error", new cg.GraphError("Missing entity loader for {0}", entityData._type));
        }
    };

    /**
     * Load a cg.Group
     * @param {Object} groupData
     * @param {cg.Graph} graph
     * @param {cg.Entity} parent
     * @private
     */
    JSONLoader.prototype._loadEntityGroup = function (groupData, graph, parent) {
        var group = new cg.Group(groupData._id, groupData._name, new pandora.Vec2(groupData.position), new pandora.Vec2(groupData.size));
        graph.addEntity(group, parent);
        pandora.forEach(groupData.children, function (childData) {
            this.loadEntity(childData, graph, group);
        }.bind(this));
    };

    /**
     * Load an cg.block.
     * @param {Object} blockData
     * @param {cg.Graph} graph
     * @param {cg.Entity} parent
     * @private
     */
    JSONLoader.prototype._loadEntityBlock = function (blockData, graph, parent) {
        var block = new cg.Block(blockData._id, graph.getModel(blockData._name), new pandora.Vec2(blockData.position), blockData.value);
        this._blocks[block.__id] = block;
        graph.addEntity(block, parent);
    };

    return JSONLoader;

})();
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
            "value-type": model.valueType
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