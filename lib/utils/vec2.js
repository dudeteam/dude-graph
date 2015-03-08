cg.Vec2 = (function () {

    /**
     * Represent a two-dimensional vector.
     * @param x {Number|Array}
     * @param y {Number}
     * @constructor
     */
    function Vec2(x, y) {
        if (x === undefined) {
            this.x = 0;
            this.y = 0;
            return;
        }
        switch (cg.functionName(x.constructor)) {
            case 'Vec2':
                this.x = x.x;
                this.y = x.y;
                break;
            case 'Array':
                this.x = x[0];
                this.y = x[1];
                break;
            default:
                this.x = x;
                this.y = y;
                break;
        }
    }

    /**
     * Set the coordinates of this vector from the given one.
     * @param other {cg.Vec2}
     */
    Vec2.prototype.copy = function (other) {
        this.x = other.x;
        this.y = other.y;
        return this;
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

    /**
     * Check collision between this vec2 and the given circle.
     * @param center {cg.Vec2|{x: Number, y: Number}}
     * @param radius {Number}
     * @returns {boolean}
     */
    Vec2.prototype.collideCircle = function (center, radius) {
        radius = radius || 5;
        var dx = this.x - center.x;
        var dy = this.y - center.y;
        return Math.sqrt(dx * dx + dy * dy) < radius * 2;
    };

    /**
     * Add the given object to this Vec2.
     * @param other {Number|cg.Vec2}
     */
    Vec2.prototype.add = function (other) {
        cg.polymorphic(other.constructor, {
            "Number": function () {
                this.x += other;
                this.y += other;
            }.bind(this),
            "Vec2": function () {
                this.x += other.x;
                this.y += other.y;
            }.bind(this)
        });
        return this;
    };

    /**
     * Subtract the given object to this Vec2.
     * @param other {Number|cg.Vec2}
     */
    Vec2.prototype.subtract = function (other) {
        cg.polymorphic(other.constructor, {
            "Number": function () {
                this.x -= other;
                this.y -= other;
            }.bind(this),
            "Vec2": function () {
                this.x -= other.x;
                this.y -= other.y;
            }.bind(this)
        });
        return this;
    };

    /**
     * Multiply the given object to this Vec2.
     * @param other {Number|cg.Vec2}
     */
    Vec2.prototype.multiply = function (other) {
        cg.polymorphic(other.constructor, {
            "Number": function () {
                this.x *= other;
                this.y *= other;
            }.bind(this),
            "Vec2": function () {
                this.x *= other.x;
                this.y *= other.y;
            }.bind(this)
        });
        return this;
    };

    /**
     * Divide the given object to this Vec2.
     * @param other {Number|cg.Vec2}
     */
    Vec2.prototype.divide = function (other) {
        cg.polymorphic(other.constructor, {
            "Number": function () {
                this.x /= other;
                this.y /= other;
            }.bind(this),
            "Vec2": function () {
                this.x /= other.x;
                this.y /= other.y;
            }.bind(this)
        });
        return this;
    };

    return Vec2;

})();
