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
        this._nextBlockId = 0;

        /**
         * Collection of blocks in the graph
         * @type {Array<cg.Block>}
         * @private
         */
        this._blocks = [];
        Object.defineProperty(this, "blocks", {
            get: function() { return this._blocks; }.bind(this)
        });

        /**
         * Map to access a block by its id
         * @type {Object} {"42": {cg.Block}}
         * @private
         */
        this._blocksIds = {};

        /**
         * Connections between blocks points
         * @type {Array<cg.Connection>}
         * @private
         */
        this._connections = [];
    });

    /**
     * Adds a block to the graph
     * @param {cg.Block} block to add to the graph
     */
    Graph.prototype.addBlock = function (block) {
        var blockId = block.cgId;
        if (block.cgGraph !== this) {
            throw new cg.GraphError("Graph::addBlock() This block does not belong to this graph");
        }
        if (blockId === null || blockId === undefined) {
            throw new cg.GraphError("Graph::addBlock() Block id is null");
        }
        if (this._blocksIds[blockId]) {
            throw new cg.GraphError("Graph::addBlock() Block with id {0} already exists", blockId);
        }
        this._blocks.push(block);
        this._blocksIds[blockId] = block;
    };

    /**
     * Returns a block by it's unique id
     * @param {String} blockId
     * @return {cg.Block}
     */
    Graph.prototype.blockById = function (blockId) {
        var block = this._blocksIds[blockId];
        if (!block) {
            throw new cg.GraphError("Graph::blockById() Block not found for id ``{0}`", blockId);
        }
        return block;
    };

    /**
     * Returns the next unique block id
     * @returns {number}
     */
    Graph.prototype.nextBlockId = function () {
        return ++this._nextBlockId;
    };

    /**
     * Returns whether this type is allowed as an input or an output
     * @param type
     * @returns {boolean}
     */
    Graph.prototype.isTypeAllowed = function (type) {
        switch (pandora.typename(type)) {
            case "Number":
            case "String":
            case "Boolean":
            case "Object":
                return true;
            default:
                return false;
        }
    };

    return Graph;

})();