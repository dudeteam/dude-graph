cg.Graph = (function () {

    /**
     * Represents the graph whom holds the entities
     * @extends {pandora.EventEmitter}
     * @constructor
     */
    var Graph = pandora.class_("Graph", pandora.EventEmitter, function () {
        pandora.EventEmitter.call(this);

        /**
         * Next block id
         * @type {Number}
         * @private
         */
        this._cgNextBlockId = 0;
        Object.defineProperty(this, "cgNextBlockId", {
            configurable: true,
            get: function () {
                return this._cgNextBlockId;
            }.bind(this)
        });

        /**
         * Collection of blocks in the graph
         * @type {Array<cg.Block>}
         * @private
         */
        this._cgBlocks = [];
        Object.defineProperty(this, "cgBlocks", {
            configurable: true,
            get: function () {
                return this._cgBlocks;
            }.bind(this)
        });

        /**
         * Map to access a block by its id
         * @type {Object} {"42": {cg.Block}}
         * @private
         */
        this._cgBlocksIds = {};
        Object.defineProperty(this, "cgBlocksIds", {
            configurable: true,
            get: function () {
                return this._cgBlocksIds;
            }.bind(this)
        });

        /**
         * Connections between blocks points
         * @type {Array<cg.Connection>}
         * @private
         */
        this._cgConnections = [];
        Object.defineProperty(this, "cgConnections", {
            configurable: true,
            get: function() {
               return this._cgConnections;
           }.bind(this)
        });
    });

    /**
     * Adds a block to the graph
     * @param {cg.Block} cgBlock to add to the graph
     * @emit "cg-block-create" {cg.Block}
     * @return {cg.Block}
     */
    Graph.prototype.addBlock = function (cgBlock) {
        var cgBlockId = cgBlock.cgId;
        if (cgBlock.cgGraph !== this) {
            throw new cg.GraphError("Graph::addBlock() This block does not belong to this graph");
        }
        if (cgBlockId === null || cgBlockId === undefined) {
            throw new cg.GraphError("Graph::addBlock() Block id is null");
        }
        if (this._cgBlocksIds[cgBlockId]) {
            throw new cg.GraphError("Graph::addBlock() Block with id `{0}` already exists", cgBlockId);
        }
        this._cgBlocks.push(cgBlock);
        this._cgBlocksIds[cgBlockId] = cgBlock;
        this._cgNextBlockId = Math.max(this._cgNextBlockId, cgBlockId);
        this.emit("cg-block-create", cgBlock);
        return cgBlock;
    };

    /**
     * Returns a block by it's unique id
     * @param {String} cgBlockId
     * @return {cg.Block}
     */
    Graph.prototype.blockById = function (cgBlockId) {
        var cgBlock = this._cgBlocksIds[cgBlockId];
        if (!cgBlock) {
            throw new cg.GraphError("Graph::blockById() Block not found for id `{0}`", cgBlockId);
        }
        return cgBlock;
    };

    /**
     * Returns the next unique block id
     * @returns {Number}
     */
    Graph.prototype.nextBlockId = function () {
        return ++this._cgNextBlockId;
    };

    /**
     * Returns a connection between two points
     * @param {cg.Point} cgOutputPoint
     * @param {cg.Point} cgInputPoint
     * @emit "cg-connection-create" {cg.Connection}
     * @returns {cg.Connection|null}
     */
    Graph.prototype.connectPoints = function(cgOutputPoint, cgInputPoint) {
        if (this.connectionByPoints(cgOutputPoint, cgInputPoint) !== null) {
            throw new cg.GraphError("Graph::connectPoints() Connection already exists between these two points: `{0}` and `{1}`", cgInputPoint.cgName, cgOutputPoint.cgName);
        }
        if (cgOutputPoint.isOutput === cgInputPoint.isOutput) {
            throw new cg.GraphError("Graph::connectPoints() Cannot connect either two inputs or two outputs: `{0}` and `{1}`", cgOutputPoint.cgName, cgInputPoint.cgName);
        }
        if (cgOutputPoint.cgValueType !== cgInputPoint.cgValueType) {
            // TODO: Handle conversion
            throw new cg.GraphError("Graph::connectPoints() Cannot connect two points of different value types: `{0}` and `{1}`", cgOutputPoint.cgValueType, cgInputPoint.cgValueType);
        }
        var cgConnection = new cg.Connection(cgOutputPoint, cgInputPoint);
        this._cgConnections.push(cgConnection);
        cgOutputPoint._cgConnections.push(cgConnection);
        cgInputPoint._cgConnections.push(cgConnection);
        this.emit("cg-connection-create", cgConnection);
        return cgConnection;
    };

    /**
     * Returns a connection between two points
     * @param {cg.Point} cgOutputPoint
     * @param {cg.Point} cgInputPoint
     * @returns {cg.Connection|null}
     */
    Graph.prototype.connectionByPoints = function(cgOutputPoint, cgInputPoint) {
        return pandora.findIf(this._cgConnections, function (cgConnection) {
            return cgConnection.cgOutputPoint === cgOutputPoint && cgConnection.cgInputPoint === cgInputPoint;
        });
    };

    /**
     * Returns the list of connections for a given point
     * @param {cg.Point} cgPoint
     * @returns {Array<cg.Connection>}
     */
    Graph.prototype.connectionsByPoint = function (cgPoint) {
        var cgConnections = [];
        pandora.forEach(this._cgConnections, function (cgConnection) {
            if (cgConnection.cgOutputPoint === cgPoint || cgConnection.cgInputPoint === cgPoint) {
                cgConnections.push(cgConnection);
            }
        });
        return cgConnections;
    };

    /**
     * Returns the list of connections for every points in the given block
     * @param cgBlock
     * @returns {Array<cg.Connection>}
     */
    Graph.prototype.connectionsByBlock = function(cgBlock) {
        var cgConnections = [];
        pandora.forEach(this._cgConnections, function (cgConnection) {
            if (cgConnection.cgOutputPoint.cgBlock === cgBlock || cgConnection.cgInputPoint.cgBlock === cgBlock) {
                cgConnections.push(cgConnection);
            }
        });
        return cgConnections;
    };

    /**
     * Clone all the given blocks
     * If connections exist between the cloned blocks, this method will try to recreate them
     * Connections from/to a cloned block to/from a non cloned block won't be duplicated
     * @param cgBlocks {Array<cg.Block>}
     */
    Graph.prototype.cloneBlocks = function(cgBlocks) {
        throw new cg.GraphError("Graph::cloneBlocks() Not yet implemented");
    };

    return Graph;

})();