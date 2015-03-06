cg.TextInput = (function () {

    var VISIBLE_CHARS = 9;

    /**
     * Create a text-input picker in SVG.
     * @param element {Object} The svg element on which the text-input will be attached
     * @param x {Number}
     * @param y {Number}
     * @param width {Number}
     * @param height {Number}
     * @constructor
     */
    function TextInput(element, x, y, width, height, dom) {
        dom = '<input type="text">';
        cg.EventEmitter.call(this);
        this._value = "";
        this._group = element.g();
        this._group.addClass("text-input");
        var input = Snap.format(
            '<foreignObject x="{x}" y="{y}" width="{width}" height="{height}">' +
                dom +
            '</foreignObject>', {"x": x, "y": y, "width": width, "height": height}
        );
        this._group.append(Snap.parse(input));
        var inputElement = this._group.select(":first-child > :first-child > :first-child");
        inputElement.node.style.width = "100%";
        inputElement.node.style.height = "100%";
        inputElement.node.style.boxSizing = "border-box";
    }

    cg.mergeObjects(TextInput.prototype, cg.EventEmitter.prototype);

    TextInput.prototype.__proto__ = {
        get value() { return this._value; },
        get rect() { return this._rect; },
        get text() { return this._text; }
    };

    return TextInput;

})();