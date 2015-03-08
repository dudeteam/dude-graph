cg.Renderer.CursorPoint = (function () {

    /**
     * Represent a point which is created at the cursor position, used to create connections.
     * @param sourcePoint {cg.Point}
     * @param position {cg.Vec2}
     * @constructor
     */
    function CursorPoint(sourcePoint, position) {
        cg.EventEmitter.call(this);
        this._type = sourcePoint.type;
        this._position = position;
        this._isInput = !sourcePoint.isInput;
        this._sourcePoint = sourcePoint
    }

    cg.inherit(CursorPoint, cg.EventEmitter);

    CursorPoint.prototype.__proto__ = {
        get type() { return this._type; },
        get position() { return this._position; },
        get isInput() { return this._isInput; },
        get sourcePoint() { return this._sourcePoint; }
    };

    return CursorPoint;

})();