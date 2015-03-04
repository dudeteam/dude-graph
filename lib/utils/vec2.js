cg.Vec2 = (function () {

    /**
     * Represent a two-dimensional vector.
     * @param x {Number|Array}
     * @param y {Number}
     * @constructor
     */
    function Vec2(x, y) {
        if (x.constructor.name === 'Array') {
            this.x = x[0];
            this.y = x[1];
        } else {
            this.x = x;
            this.y = y;
        }
    }

    /**
     * Returns the Vec2 has 2D array
     * @returns {Number[]}
     */
    Vec2.prototype.serialize = function () {
        return [this.x, this.y];
    };

    return Vec2;

})();
