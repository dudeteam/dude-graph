/**
 * Render the action.
 * @param action {cg.Action}
 * @private
 */
cg.Renderer.prototype._renderAction = function (action) {
    var actionGroup = this._actionLayer.g();
    var backgroundGroup = actionGroup.g();
    this._dataBinding(action, actionGroup);
    actionGroup.data('action', action);
    actionGroup.addClass("action");
    var inputs = [];
    var inputMaxWidth = 0;
    for (var inputName in action.inputs) {
        if (action.inputs.hasOwnProperty(inputName)) {
            var inputPoint = action.inputs[inputName];
            var inputGroup = this.render(inputPoint, actionGroup);
            inputMaxWidth = Math.max(inputMaxWidth, inputGroup.getBBox().width);
            inputs.push(inputGroup);
        }
    }
    var outputs = [];
    var outputMaxWidth = 0;
    for (var outputName in action.outputs) {
        if (action.outputs.hasOwnProperty(outputName)) {
            var outputPoint = action.outputs[outputName];
            var outputGroup = this.render(outputPoint, actionGroup);
            outputMaxWidth = Math.max(outputMaxWidth, outputGroup.getBBox().width);
            outputs.push(outputGroup);
        }
    }
    var actionText = actionGroup.text(0, this._config.action["padding"], action.name);
    var actionWidth = Math.max(inputMaxWidth + outputMaxWidth + this._config.action["center-spacing"], actionText.getBBox().width);
    actionWidth += this._config.action["padding"] * 2;
    actionWidth = this._paper.background.round(actionWidth);
    var actionHeight = this._config.action["heading"] + action.height * this._config.point["height"];
    actionHeight = this._paper.background.round(actionHeight);
    var actionRect = backgroundGroup.rect(0, 0, actionWidth, actionHeight, this._config.action["border-radius"]);
    actionRect.addClass("background");
    actionText.transform("T " + actionWidth / 2);
    actionText.addClass("title");
    if (action.model.type === "getter") {
        actionRect.attr("stroke", "#e5678d");
        actionText.attr("fill", "#e5678d");
    }
    action.data.computedWidth = actionWidth;
    for (var inputIndex = 0; inputIndex < inputs.length; ++inputIndex) {
        var inputPosition = this._getPointRelativePosition(this._getNode(inputs[inputIndex]));
        inputs[inputIndex].transform(Snap.format("T {x} {y}", {x: inputPosition.x, y: inputPosition.y}));
    }
    for (var outputIndex = 0; outputIndex < outputs.length; ++outputIndex) {
        var outputPosition = this._getPointRelativePosition(this._getNode(outputs[outputIndex]));
        outputs[outputIndex].transform(Snap.format("T {x} {y}", {x: outputPosition.x, y: outputPosition.y}));
    }
    action.on("move", this._updateAction.bind(this, action, actionGroup));
    action.on("remove", function() { actionGroup.remove(); });
    this._updateAction(action, actionGroup);
    this._dragNode(action, actionGroup);
    return actionGroup;
};

/**
 * Update the action position.
 * @param action
 * @param actionGroup
 * @private
 */
cg.Renderer.prototype._updateAction = function (action, actionGroup) {
    actionGroup.transform("T" + action.absolutePosition().toArray());
};