cg.Box2 = (function () {

    /**
     * Represent a 2D box.
     * @param x {Number|cg.Vec2|Array}
     * @param y {Number|cg.Vec2}
     * @param width {Number}
     * @param height {Number}
     * @constructor
     */
    function BBox(x, y, width, height) {
        if (x === undefined) {
            this.x = 0;
            this.y = 0;
            this.width = 0;
            this.height = 0;
            return;
        }
        switch (cg.functionName(x.constructor)) {
            case 'Vec2':
                this.x = x.x;
                this.y = x.y;
                this.width = y.x;
                this.height = y.y;
                break;
            case 'Array':
                this.x = x[0];
                this.y = x[1];
                this.width = x[2];
                this.height = x[3];
                break;
            default:
                this.x = x;
                this.y = y;
                this.width = width;
                this.height = height;
                break;
        }
    }

    /**
     * Set the coordinates of this 2D box from the given one.
     * @param other {cg.Box2}
     */
    BBox.prototype.copy = function (other) {
        this.x = other.x;
        this.y = other.y;
        this.width = other.width;
        this.height = other.height;
    };

    /**
     * Return a new 2D box with the coordinates of this one.
     * @returns {cg.Box2}
     */
    BBox.prototype.clone = function () {
        return new cg.Box2(this.x, this.y, this.width, this.height);
    };

    return BBox;

})();
