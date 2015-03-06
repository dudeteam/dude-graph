cg.BackgroundGrid = (function () {

    /**
     * Create a dynamic background grid.
     * @param paper {Element}
     * @param style {Object}
     * @constructor
     */
    function BackgroundGrid(paper, style) {
        this._style = style || {
            "pattern-size": 10,
            "step-size": 5,
            "line": {
                "stroke": "rgba(255, 255, 255, 0.05)",
                "stroke-width": 1
            },
            "big-line": {
                "stroke": "rgba(255, 255, 255, 0.2)",
                "stroke-width": 1
            }
        };
        this._paper = paper;
        this._rect = paper.rect(0, 0, "100%", "100%");
        this.update(1.0, new cg.Vec2(0, 0));
    }

    /**
     * Update the grid according the current zoom and pan values.
     * @param size {Number}
     * @param pan {cg.Vec2}
     */
    BackgroundGrid.prototype.update = function (size, pan) {
        size *= this._style["pattern-size"];
        var s = this._style["step-size"];
        var cross = this._paper.g();
        for (var y = 0; y < s; ++y) {
            var ty = pan.y * size + y * size;
            var ly = cross.line(pan.x, ty, pan.x + size * s, ty);
            ly.attr(y == 0 ? this._style["big-line"] : this._style["line"]);
        }
        for (var x = 0; x < s; ++x) {
            var tx = pan.x * size + x * size;
            var lx = cross.line(tx, pan.y, tx, pan.y + size * s);
            lx.attr(x == 0 ? this._style["big-line"] : this._style["line"]);
        }
        this._rect.attr({fill: cross.pattern(pan.x, pan.y, size * s, size * s)});
    };

    return BackgroundGrid;

})();