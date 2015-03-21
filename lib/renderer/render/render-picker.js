cg.Renderer.prototype._createPickerText = function (block, element) {
    element.append("svg:text").attr({
        "class": "title",
        "text-anchor": "start",
        "alignment-baseline": "middle"
    });
};

cg.Renderer.prototype._updatePickerText = function (block, element, text) {
    element.select(".title")
        .attr({x: this._config.block.padding, y: this._config.block.padding})
        .text(text);
    block.data.computedWidth += element.select(".title").node().getBBox().width;
};

cg.Renderer.prototype._createPickerBoolean = function (block, element) {
    this._createPickerText(block, element);
};

cg.Renderer.prototype._updatePickerBoolean = function (block, element) {
    this._updatePickerText(block, element, block.value ? "true" : "false");
};

cg.Renderer.prototype._createPickerNumber = function (block, element) {
    this._createPickerText(block, element);
};

cg.Renderer.prototype._updatePickerNumber = function (block, element) {
    this._updatePickerText(block, element, block.value);
};

cg.Renderer.prototype._createPickerString = function (block, element) {
    this._createPickerText(block, element);
};

cg.Renderer.prototype._updatePickerString = function (block, element) {
    this._updatePickerText(block, element, "\"" + block.value + "\"");
};

cg.Renderer.prototype._createPickerVec2 = function (block, element) {
    this._createPickerText(block, element);
};

cg.Renderer.prototype._updatePickerVec2 = function (block, element) {
    this._updatePickerText(block, element, "Vec2(" + block.value.join(", ") + ")");
};

cg.Renderer.prototype._createPickerVec3 = function (block, element) {
    this._createPickerText(block, element);
};

cg.Renderer.prototype._updatePickerVec3 = function (block, element) {
    this._updatePickerText(block, element, "Vec3(" + block.value.join(", ") + ")");
};

cg.Renderer.prototype._createPickerColor = function (block, element) {
    element.append("svg:rect")
        .attr({
            "class": "color-rect",
            "rx": this._config.block.borderRadius,
            "ry": this._config.block.borderRadius,
            "width": 40,
            "height": 20,
            "fill": block.value,
            "stroke": block.value
        });
};

cg.Renderer.prototype._updatePickerColor = function (block, element) {
    var rect = element.select(".color-rect");
    block.data.computedWidth += parseInt(rect.attr("width"));
    element.select(".color-rect").attr({
        "x": this._config.block.padding,
        "y": rect.attr("height") / 2
    });
};