/**
 *
 * @constructor
 */
dudeGraph.RenderPoint = function (renderBlock, point, index) {
    /**
     * @type {dudeGraph.RenderBlock}
     */
    this._renderBlock = renderBlock;
    Object.defineProperty(this, "renderBlock", {
        get: function () {
            return this._renderBlock;
        }.bind(this)
    });

    /**
     * @type {Number}
     */
    this._index = index;
    Object.defineProperty(this, "index", {
        get: function () {
            return this._index;
        }.bind(this)
    });

    /**
     * @type {dudeGraph.Point}
     */
    this._point = point;
    Object.defineProperty(this, "point", {
        get: function () {
            return this._point;
        }.bind(this)
    });

    /**
     * @type {d3.selection}
     * @private
     */
    this._d3PointGroup = null;
    Object.defineProperty(this, "d3PointGroup", {
        get: function () {
            return this._d3PointGroup;
        }.bind(this)
    });
};

/**
 *
 * @param d3PointGroup
 */
dudeGraph.RenderPoint.prototype.create = function (d3PointGroup) {
    this._d3PointGroup = d3PointGroup;
    d3PointGroup
        .append("svg:circle")
        .attr({
            "cx": this._point.isOutput * 100,
            "cy": 20 + this._index * 20,
            "r": 5
        });
    d3PointGroup
        .append("svg:text")
        .text(this._point.cgName)
        .attr({
            "x": 20 + this._point.isOutput * 100,
            "y": 20 + this._index * 20
        });
};

/**
 *
 */
dudeGraph.RenderPoint.prototype.update = function () {

};

/**
 *
 */
dudeGraph.RenderPoint.prototype.remove = function () {

};