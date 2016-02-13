/**
 * Point is a named value that is held by a block, it can accepts a direct value or be connected to other compatible block points
 * @param {dudeGraph.Block} pointBlock
 * @param {Boolean} pointOutput
 * @param {Object} pointData
 * @param {String} pointData.pointName
 * @param {String|null} [pointData.pointTemplate=null]
 * @param {String} pointData.pointValueType
 * @param {String|null} [pointData.pointValue=null]
 * @param {Boolean} [pointData.pointSingleConnection=true]
 * @class
 * @extends {EventEmitter}
 */
dudeGraph.Point = function (pointBlock, pointOutput, pointData) {
    /**
     * The parent block
     * @type {dudeGraph.Block}
     * @readonly
     * @protected
     */
    this._pointBlock = pointBlock;

    /**
     * Whether the point is an output or an input
     * @type {Boolean}
     * @readonly
     * @protected
     */
    this._pointOutput = pointOutput;
    Object.defineProperty(this, "pointOutput", {
        get: function () {
            return this._pointOutput;
        }.bind(this)
    });

    /**
     * The point type
     * @type {String}
     * @readonly
     * @protected
     */
    this._pointType = this.className;
    Object.defineProperty(this, "pointType", {
        get: function () {
            return this._pointType;
        }.bind(this)
    });

    /**
     * The point name
     * @type {String}
     * @protected
     */
    this._pointName = null;
    Object.defineProperty(this, "pointName", {
        get: function () {
            return this._pointName;
        }.bind(this)
    });

    /**
     * The point template
     * @type {String}
     * @protected
     */
    this._pointTemplate = null;
    Object.defineProperty(this, "pointTemplate", {
        get: function () {
            return this._pointTemplate;
        }.bind(this)
    });

    /**
     * The type of the value this point holds
     * @type {String|null}
     * @protected
     */
    this._pointValueType = null;
    Object.defineProperty(this, "pointValueType", {
        get: function () {
            return this._pointValueType;
        }.bind(this)
    });

    /**
     * The value this point holds of `pointValueType`
     * @type {Object|null}
     * @protected
     */
    this._pointValue = null;
    Object.defineProperty(this, "pointValue", {
        get: function () {
            return this._pointValue;
        }.bind(this)
    });

    /**
     * The connections involving this point
     * @type {Array<dudeGraph.Connection>}
     * @protected
     */
    this._pointConnections = [];
    Object.defineProperty(this, "pointConnections", {
       get: function () {
           return this._pointConnections;
       }.bind(this)
    });

    /**
     * Whether this point can only accept one connection
     * @type {Boolean}
     * @protected
     */
    this._pointSingleConnection = true;
    Object.defineProperty(this, "pointSingleConnection", {
        get: function () {
            return this._pointSingleConnection;
        }.bind(this)
    });

    this.initialize(pointData);
};

dudeGraph.Point.prototype = _.create(EventEmitter.prototype, {
    "constructor": dudeGraph.Point,
    "className": "Point"
});

/**
 * Initializes the point
 * @param {Object} pointData
 * @param {String} pointData.pointName
 * @param {String|null} [pointData.pointTemplate=null]
 * @param {String} pointData.pointValueType
 * @param {String|null} [pointData.pointValue=null]
 * @param {Boolean} [pointData.pointSingleConnection=true]
 */
dudeGraph.Point.prototype.initialize = function (pointData) {
    this._pointName = pointData.pointName;
    this._pointTemplate = pointData.pointTemplate || null;
    this._pointValueType = pointData.pointValueType;
    this._pointValue = pointData.pointValue || null;
    this._pointSingleConnection = pointData.pointSingleConnection || true;
};

dudeGraph.Point.prototype.emptyValue = function (point) {};
dudeGraph.Point.prototype.emptyConnection = function (point) {};
dudeGraph.Point.prototype.empty = function (point) {};

dudeGraph.Point.prototype.changeValueType = function (valueType) {};
dudeGraph.Point.prototype.changeValue = function (value) {};

dudeGraph.Point.prototype.connect = function (point) {};
dudeGraph.Point.prototype.disconnect = function (point) {};
dudeGraph.Point.prototype.disconnectAll = function () {};

dudeGraph.Point.prototype.clone = function () {};