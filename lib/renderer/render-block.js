/**
 * Render the action.
 * @param block {cg.Block}
 * @private
 */
cg.Renderer.prototype._renderBlock = function (block) {
    var functionName = "_renderBlock" + cg.camelcase(block.model.type);
    if (this[functionName] === undefined) {
        this.emit("error", new Error("Missing overload function '" + functionName + "'."));
    }
    var blockGroup = this._blockLayer.g();
    this._setNode(block, blockGroup);
    blockGroup.addClass("block");
    this[functionName](block, blockGroup);
    block.on("move", this._updateBlock.bind(this, block, blockGroup));
    block.on("remove", function() { blockGroup.remove(); });
    this._updateBlock(block, blockGroup);
    this._dragNode(block, blockGroup);
    return blockGroup;
};

cg.Renderer.prototype._renderBlockAction = function (action, element) {
    var backgroundGroup = element.g();
    element.data('action', action);
    element.addClass("action");
    var inputs = [];
    var inputMaxWidth = 0;
    for (var inputName in action.inputs) {
        if (action.inputs.hasOwnProperty(inputName)) {
            var inputPoint = action.inputs[inputName];
            var inputGroup = this.render(inputPoint, element);
            inputMaxWidth = Math.max(inputMaxWidth, inputGroup.getBBox().width);
            inputs.push(inputGroup);
        }
    }
    var outputs = [];
    var outputMaxWidth = 0;
    for (var outputName in action.outputs) {
        if (action.outputs.hasOwnProperty(outputName)) {
            var outputPoint = action.outputs[outputName];
            var outputGroup = this.render(outputPoint, element);
            outputMaxWidth = Math.max(outputMaxWidth, outputGroup.getBBox().width);
            outputs.push(outputGroup);
        }
    }
    var actionText = element.text(0, this._config.block["padding"], action.name);
    var actionWidth = Math.max(inputMaxWidth + outputMaxWidth + this._config.block["center-spacing"], actionText.getBBox().width);
    actionWidth += this._config.block["padding"] * 2;
    actionWidth = this._paper.background.round(actionWidth);
    var actionHeight = this._config.block["heading"] + action.height * this._config.point["height"];
    actionHeight = this._paper.background.round(actionHeight);
    var actionRect = backgroundGroup.rect(0, 0, actionWidth, actionHeight, this._config.block["border-radius"]);
    actionRect.addClass("background");
    actionText.transform("T " + actionWidth / 2);
    actionText.addClass("title");
    if (action.model.type === "getter") {
        actionRect.attr("stroke", "#e5678d");
        actionText.attr("fill", "#e5678d");
    }
    action.data.computedHeadingOffset = this._config.block["heading"];
    action.data.computedWidth = actionWidth;
    for (var inputIndex = 0; inputIndex < inputs.length; ++inputIndex) {
        var inputPosition = this._getPointRelativePosition(this._getNode(inputs[inputIndex]));
        inputs[inputIndex].transform(Snap.format("T {x} {y}", {x: inputPosition.x, y: inputPosition.y}));
    }
    for (var outputIndex = 0; outputIndex < outputs.length; ++outputIndex) {
        var outputPosition = this._getPointRelativePosition(this._getNode(outputs[outputIndex]));
        outputs[outputIndex].transform(Snap.format("T {x} {y}", {x: outputPosition.x, y: outputPosition.y}));
    }
    return element;
};

cg.Renderer.prototype._renderBlockGetter = function (getter, element) {
    element.addClass("getter");
    element.addClass("type-" + getter.model.outputs[0].type);
    var backgroundGroup = element.g();
    var text = element.text(this._config.block["padding"], 0, getter.name);
    text.addClass("title");
    var width = this._paper.background.round(text.getBBox().width + this._config.block["padding"] * 3 + this._config.point["circle-size"]);
    var backgroundRect = backgroundGroup.rect(0, 0, width, this._config.getter["height"], this._config.block["border-radius"]);
    backgroundRect.addClass("background");
    var pointGroup = element.g();
    getter.data.computedHeadingOffset = this._config.getter["height"] / 2;
    getter.data.computedWidth = width;
    var circlePoint = this._renderPointCircle(getter.getPoint(0, "outputs"), pointGroup);
    circlePoint.transform("T " + [width - this._config.block["padding"], this._config.getter["height"] / 2]);
    text.transform("T " + [0, this._config.getter["height"] / 2 + text.getBBox().height / 4]);
    return element;
};

cg.Renderer.prototype._renderBlockPicker = function (picker, element) { // TODO resize the picker when value change
    element.addClass("picker");
    element.addClass("type-" + picker.model.outputs[0].type);
    var backgroundGroup = element.g();
    var functionName = "_renderPicker" + cg.camelcase(picker.model.outputs[0].type);
    if (this[functionName] === undefined) {
        this.emit("error", new cg.RendererError("Missing function '" + functionName + "'"));
    }
    var pickerElement = this[functionName](picker, element);
    pickerElement.addClass("element");
    var width = this._paper.background.round(pickerElement.data("width") + this._config.block["padding"] * 2 + this._config.point["circle-size"]);
    var backgroundRect = backgroundGroup.rect(0, 0, width, this._config.getter["height"], this._config.block["border-radius"]);
    backgroundRect.addClass("background");
    var pointGroup = element.g();
    picker.data.computedHeadingOffset = this._config.getter["height"] / 2;
    picker.data.computedWidth = width;
    var circlePoint = this._renderPointCircle(picker.getPoint(0, "outputs"), pointGroup);
    circlePoint.transform("T " + [width - this._config.block["padding"], this._config.getter["height"] / 2]);
    pickerElement.mousedown(function (e) {
        this.emit("picker.edit", picker);
        cg.preventCallback(e);
    }.bind(this));
    return element;
};

cg.Renderer.prototype._renderPickerVec2 = function (picker, element) {
    var p = this._config.block["padding"] / 2;
    var text = element.text(p, 0, "vec2(" + picker.value.join(", ") + ")");
    text.addClass("title");
    text.data("width", text.getBBox().width);
    text.transform("T " + [0, this._config.getter["height"] / 2 + text.getBBox().height / 4]);
    picker.on("change", function () {
        text.attr("text", "vec2(" + picker.value.join(", ") + ")");
    });
    return text;
};

cg.Renderer.prototype._renderPickerVec3 = function (picker, element) {
    var p = this._config.block["padding"] / 2;
    var text = element.text(p, 0, "vec3(" + picker.value.join(", ") + ")");
    text.addClass("title");
    text.data("width", text.getBBox().width);
    text.transform("T " + [0, this._config.getter["height"] / 2 + text.getBBox().height / 4]);
    picker.on("change", function () {
        text.attr("text", "vec3(" + picker.value.join(", ") + ")");
    });
    return text;
};

cg.Renderer.prototype._renderPickerString = function (picker, element) {
    var p = this._config.block["padding"] / 2;
    var text = element.text(p, 0, "\"" + picker.value + "\"");
    text.addClass("title");
    text.data("width", text.getBBox().width);
    text.transform("T " + [0, this._config.getter["height"] / 2 + text.getBBox().height / 4]);
    picker.on("change", function () {
        text.attr("text", "\"" + picker.value + "\"");
    });
    return text;
};

cg.Renderer.prototype._renderPickerColor = function (picker, element) {
    var p = this._config.block["padding"] / 2;
    var h = this._config.getter["height"];
    var rect = element.rect(p, p, 30, h - p * 2, 5);
    rect.attr("fill", picker.value);
    rect.attr("stroke", "transparent");
    rect.data("width", 30);
    picker.on("change", function () {
        rect.attr("fill", picker.value);
    });
    return rect;
};

cg.Renderer.prototype._renderPickerBoolean = function (picker, element) {
    var p = this._config.block["padding"] / 2;
    var text = element.text(p, 0, picker.value ? "true" : "false");
    text.addClass("title");
    text.data("width", text.getBBox().width);
    text.transform("T " + [0, this._config.getter["height"] / 2 + text.getBBox().height / 4]);
    picker.on("change", function () {
        text.attr("text", picker.value ? "true" : "false");
    });
    return text;
};


/**
 * Update the action position.
 * @param block
 * @param group
 * @private
 */
cg.Renderer.prototype._updateBlock = function (block, group) {
    group.transform("T" + block.absolutePosition().toArray());
};