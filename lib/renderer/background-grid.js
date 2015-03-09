cg.Renderer.Grid = (function () {

    /**
     * Create a dynamic background grid.
     * @param paper {Element}
     * @param config {Object}
     * @constructor
     */
    function Grid(paper, config) {
        this._config = config || {
            "pattern-size": 10,
            "step-size": 5,
            "line": {
                "stroke": "rgba(255, 255, 255, 0.05)",
                "stroke-width": 2
            },
            "big-line": {
                "stroke": "rgba(255, 255, 255, 0.2)",
                "stroke-width": 3
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
    Grid.prototype.update = function (size, pan) {
        size *= this._config["pattern-size"];
        var s = this._config["step-size"];
        var cross = this._paper.g();
        for (var y = 1; y < s; ++y) {
            var ty = pan.y + y * size;
            cross.line(pan.x, ty, pan.x + size * s, ty).attr(this._config["line"]);
        }
        for (var x = 1; x < s; ++x) {
            var tx = pan.x + x * size;
            cross.line(tx, pan.y, tx, pan.y + size * s).attr(this._config["line"]);
        }
        cross.line(pan.x, pan.y, pan.x + size * s, pan.y).attr(this._config["big-line"]);
        cross.line(pan.x, pan.y, pan.x, pan.y + size * s).attr(this._config["big-line"]);
        this._rect.attr({"fill": cross.pattern(pan.x, pan.y, size * s, size * s)});
    };

    /**
     * Round the given value to match grid lines.
     * @param value {Number} the value to round
     * @param bigger {Boolean?} Whether to use the big lines or the small ones.
     */
    Grid.prototype.round = function (value, bigger) {
        var s = bigger ? this._config["pattern-size"] * this._config["step-size"] : this._config["pattern-size"];
        return value % s === 0 ? value : value - value % s + s;
    };

    return Grid;

})();