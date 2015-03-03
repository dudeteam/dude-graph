/**
 * Represent a point into the graph to connect an action to another.
 * @param action {cg.Action} The action on which the point is attached.
 * @param index {Number} The vertical index of the point within the block.
 * @param type {Number} The type of this connection (e.g. Number, Color, etc...).
 * @param name {Number} The name of this connection.
 * @param isInput {Boolean} Whether the point is an input or an output.
 * @constructor
 */
cg.Point = function (action, index, type, name, isInput) {
    this._action = action;
    this._index = index;
    this._type = type;
    this._name = name;
    this._isInput = isInput;
};

cg.Point.prototype = {
    get action() { return this._action; },
    get index() { return this._index; },
    get type() { return this._type; },
    get name() { return this._name; },
    get isInput() { return this._isInput; }
};