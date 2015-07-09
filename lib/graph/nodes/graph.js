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
         * @type {number}
         * @private
         */
        this._nextBlockId = 0;

        /**
         * Collection of blocks in the graph
         * @type {Array}
         * @private
         */
        this._blocks = [];

        /**
         * Map to access a block by its id
         * @type {Object}
         * @private
         */
        this._blocksIds = {};
    });

    /**
     * Adds a block to the graph
     * @param {cg.Block} block
     */
    Graph.prototype.addBlock = function (block) {
        var blockId = block.cgId;
        if (blockId === null || blockId === undefined) {
            throw new cg.GraphError("Graph::addBlock() block id is null");
        }
        if (this._blocksIds[blockId]) {
            throw new cg.GraphError("Graph::addBlock() block with id {0} already exists", blockId);
        }
        this._blocks.push(block);
        this._blocksIds[blockId] = block;
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
                return true;
            default:
                return false;
        }
    };

    return Graph;

})();