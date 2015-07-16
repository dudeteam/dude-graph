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

        /**
         * Collection of blocks in the graph
         * @type {Array<cg.Block>}
         * @private
         */
        this._cgBlocks = [];
        Object.defineProperty(this, "cgBlocks", {
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

        /**
         * Connections between blocks points
         * @type {Array<cg.Connection>}
         * @private
         */
        this._cgConnections = [];
    });

    /**
     * Adds a block to the graph
     * @param {cg.Block} cgBlock to add to the graph
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
            throw new cg.GraphError("Graph::addBlock() Block with id {0} already exists", cgBlockId);
        }
        this._cgBlocks.push(cgBlock);
        this._cgBlocksIds[cgBlockId] = cgBlock;
        this._cgNextBlockId = Math.max(this._cgNextBlockId, cgBlockId);
    };

    /**
     * Returns a block by it's unique id
     * @param {String} cgBlockId
     * @return {cg.Block}
     */
    Graph.prototype.blockById = function (cgBlockId) {
        var cgBlock = this._cgBlocksIds[cgBlockId];
        if (!cgBlock) {
            throw new cg.GraphError("Graph::blockById() Block not found for id ``{0}`", cgBlockId);
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
     * @returns {cg.Connection|null}
     */
    Graph.prototype.connectPoints = function(cgOutputPoint, cgInputPoint) {
        if (this.connectionByPoints(cgOutputPoint, cgInputPoint) !== null) {
            throw new cg.GraphError("Graph::connectPoints() Connection already exists between these two points: `{0}` and `{1}`", cgInputPoint.cgName, cgOutputPoint.cgName);
        }
        var cgConnection = new cg.Connection(cgOutputPoint, cgInputPoint);
        this._cgConnections.push(cgConnection);
        cgOutputPoint._cgConnections.push(cgConnection);
        cgInputPoint._cgConnections.push(cgConnection);
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
        // TODO
        throw new cg.GraphError("Graph::connectionByPoints() Not yet implemented");
    };

    return Graph;

})();