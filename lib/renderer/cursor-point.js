cg.Renderer.CursorPoint = (function () {

    /**
     * TODO
     * @param sourcePoint
     * @param position
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