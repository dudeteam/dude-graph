/**
 *
 * @param blockId
 * @param cgBlock
 * @constructor
 */
dudeGraph.RenderBlock = function (blockId, cgBlock) {
    dudeGraph.RenderNode.call(this, blockId);

    /**
     * The dudeGraph.Block this renderBlock is linked to
     * @type {dudeGraph.Block}
     * @private
     */
    this._block = cgBlock;
    Object.defineProperty(this, "block", {
        get: function () {
            return this._block;
        }.bind(this)
    });
};

/**
 * @extends {dudeGraph.RenderNode}
 */
dudeGraph.RenderBlock.prototype = _.create(dudeGraph.RenderNode.prototype, {
    "constructor": dudeGraph.RenderBlock
});

/**
 * Creates the d3Block for this renderBlock
 * @param {d3.selection} d3BlockGroup
 */
dudeGraph.RenderBlock.prototype.create = function (d3BlockGroup) {
    dudeGraph.RenderNode.prototype.create.call(this, d3BlockGroup);
    this._rect = d3BlockGroup.append("svg:rect");
    this._title = d3BlockGroup.append("svg:text");
};

/**
 * Updates the d3Block for this renderBlock
 */
dudeGraph.RenderBlock.prototype.update = function () {
    this._title
        .text(this._nodeName);
    this._rect
        .attr({
            "x": 0,
            "y": 0,
            "width": this._nodeSize[0],
            "height": this._nodeSize[1]
        });
    this.move();
};