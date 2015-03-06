cg.BBox = (function () {

    /**
     * Represent a bounding-box.
     * @param x {Number|Array}
     * @param y {Number}
     * @param width {Number}
     * @param height {Number}
     * @constructor
     */
    function BBox(x, y, width, height) {
        if (cg.functionName(x.constructor) === 'Array') {
            this.x = x[0];
            this.y = x[1];
            this.width = x[2];
            this.height = x[3];
        } else {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
        }
    }

    /**
     * Set the coordinates of this bbox from the given one.
     * @param other {cg.BBox}
     */
    BBox.prototype.copy = function (other) {
        this.x = other.x;
        this.y = other.y;
        this.width = other.width;
        this.height = other.height;
    };

    /**
     * Return a new bbox with the coordinates of this one.
     * @returns {cg.BBox}
     */
    BBox.prototype.clone = function () {
        return new cg.BBox(this.x, this.y, this.width, this.height);
    };

    return BBox;

})();
