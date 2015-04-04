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

