cg.Box2 = (function () {

    /**
     * Represent a 2D box.
     * @param x {Number|cg.Vec2|Array}
     * @param y {Number|cg.Vec2}
     * @param width {Number}
     * @param height {Number}
     * @constructor
     */
    function Box2(x, y, width, height) {
        if (x === undefined) {
            Box2.prototype.fromArray.call(this, [0, 0, 0, 0]);
        } else if (cg.functionName(x.constructor) === "Vec2") {
            Box2.prototype.fromArray.call(this, [x.x, x.y, y.x, y.y]);
        } else if (cg.functionName(x.constructor) === "Array") {
            Box2.prototype.fromArray.call(this, x);
        } else if (typeof x === "object" && y === undefined && width === undefined && height === undefined) {
            Box2.prototype.copy.call(this, x);
        } else {
            Box2.prototype.fromArray.call(this, [x, y, width, height]);
        }
    }

    /**
     * Set the coordinates of this 2D box from the given one.
     * @param other {{x: Number, y: Number, width: Number, height: Number}}
     */
    Box2.prototype.copy = function (other) {
        this.x = other.x;
        this.y = other.y;
        this.width = other.width;
        this.height = other.height;
    };

    /**
     * Return a new 2D box with the coordinates of this one.
     * @returns {cg.Box2}
     */
    Box2.prototype.clone = function () {
        return new cg.Box2(this.x, this.y, this.width, this.height);
    };

    /**
     * Update the box values from the given array.
     * @param array {[Number, Number, Number, Number]}
     */
    Box2.prototype.fromArray = function (array) {
        this.x = array[0];
        this.y = array[1];
        this.width = array[2];
        this.height = array[3];
    };

    /**
     * Convert the box into a javascript array.
     * @returns {[Number, Number, Number, Number]}
     */
    Box2.prototype.toArray = function () {
        return [this.x, this.y, this.width, this.height];
    };

    /**
     * Check whether the given other collides with this one.
     * @param other {cg.Box2}
     * @returns {boolean}
     */
    Box2.prototype.collide = function (other) {
        return cg.polymorphic(other.constructor, {
            "Vec2": function () {
                return other.x >= this.x && other.x <= this.x + this.width &&
                    other.y >= this.y && other.y <= this.y + this.height;
            }.bind(this),
            "Box2": function () {
                return this.x < other.x + other.width && this.x + this.width > other.x &&
                    this.y < other.y + other.height && this.height + this.y > other.y;
            }.bind(this)
        });
    };

    /**
     * Check whether the given other fit within this one.
     * @param other {cg.Box2}
     * @returns {boolean}
     */
    Box2.prototype.contain = function (other) {
        return cg.polymorphic(other.constructor, {
            "Vec2": function () {
                return other.x >= this.x && other.x <= this.x + this.width &&
                    other.y >= this.y && other.y <= this.y + this.height;
            }.bind(this),
            "Box2": function () {
                return other.x > this.x && other.x + other.width < this.x + this.width &&
                    other.y > this.y && other.y + other.height < this.y + this.height;
            }.bind(this)
        });
    };

    return Box2;

})();
