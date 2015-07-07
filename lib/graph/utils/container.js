cg.Container = (function() {

    /**
     * Entity container.
     * @constructor
     */
    var Container = pandora.class_("Container", function() {

        /**
         * Entities contained in this container.
         * @type {Array<cg.Entity>}
         * @private
         */
        this._entities = [];
        Object.defineProperty(this, "entities", {
            get: function() { return this._entities; }.bind(this)
        });
    });

    /**
     * Add the given entity.
     * @param entity {cg.Entity}
     */
    Container.prototype.add = function(entity) {
        this._entities.push(entity);
    };

    /**
     * Remove the given entity.
     * @param entity {cg.Entity}
     */
    Container.prototype.remove = function(entity) {
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
    Container.prototype.get = function(i) {
        return this._entities[i];
    };

    /**
     * Call the callback for each entity.
     * @param callback {Function}
     */
    Container.prototype.forEach = function(callback) {
        for (var i = 0; i < this._entities.length; ++i) {
            if (callback(this._entities[i])) {
                return true;
            }
        }
        return false;
    };

    return Container;

})();
