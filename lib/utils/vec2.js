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
     * Set the coordinates of this vector from the given one.
     * @param other
     */
    Vec2.prototype.copy = function (other) {
        this.x = other.x;
        this.y = other.y;
    };

    /**
     * Return a new vector with the coordinates of this one.
     * @returns {cg.Vec2}
     */
    Vec2.prototype.clone = function () {
        return new cg.Vec2(this.x, this.y);
    };

    /**
     * Returns the Vec2 has 2D array
     * @returns {Number[]}
     */
    Vec2.prototype.toArray = function () {
        return [this.x, this.y];
    };

    return Vec2;

})();