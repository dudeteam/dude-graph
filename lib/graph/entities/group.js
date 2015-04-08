cg.Group = (function () {

    /**
     * Represent a group instance into the graph, a group is a container for grouping sub-entities.
     * @param _id {Number|String} the unique id within the graph for this kind of entity.
     * @param description {String} the description of the group content
     * @param position {pandora.Vec2} the position on the screen.
     * @param size {pandora.Vec2} the size on the screen.
     * @extends cg.Entity
     * @constructor
     */
    var Group = pandora.class_("Group", cg.Entity, function (_id, description, position, size) {
        cg.Entity.call(this, _id, this.constructor.typename, description, position);

        /**
         * Group can change its description.
         */
        this._name = description;
        Object.defineProperty(this, "description", {
            get: function () { return this._name; }.bind(this),
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

