cg.TextInput = (function () {

    /**
     * Create a text-input picker in SVG.
     * @param element {Object} The svg element on which the text-input will be attached
     * @param position {cg.Vec2} The position of the text-input on the screen.
     * @constructor
     */
    function TextInput(element, position) {
        cg.EventEmitter.call(this);
        this._value = "";
        this._group = element.g();
        this._group.addClass("text-input");
        this._rect = this._group.rect(position.x, position.y, 150, 40, 5);
        this._text = this._group.text(this._value, position.x, position.y);
    }

    cg.mergeObjects(TextInput.prototype, cg.EventEmitter.prototype);

    TextInput.prototype.__proto__ = {
        get value() { return this._value; },
        get rect() { return this._rect; },
        get text() { return this._text; }
    };

    return TextInput;

})();